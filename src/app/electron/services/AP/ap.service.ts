import { Injectable } from "@angular/core";
import { existsSync, mkdirSync } from "fs";
import { List } from "immutable";
import { extname, join } from "path";
import { Subject } from "rxjs";
import { APAnalysis } from "../../models/analysis";
import { AnalysisItem } from "../../models/analysisItem";
import { defaultAnalyses } from "../../models/defaultAnalyses";
import APTerminal from "../../models/terminal";
import { ElectronService } from "../electron/electron.service";
import { FileSystemService } from "../file-system/file-system.service";

@Injectable({
  providedIn: "root"
})
export class APService extends ElectronService {
  /**
   * Cancel analysis
   */
  private cancel: boolean;
  /**
   * Pause analysis
   */
  private pause: boolean;

  constructor(private fileSystem: FileSystemService) {
    super();

    if (!this.isElectron) {
      return;
    }

    this.pause = false;
    this.cancel = false;

    setTimeout(() => {
      //TODO Add a check for the version AP to determine if an update is required

      // Download AP to client computer
      if (!existsSync(APTerminal.apFolder)) {
        mkdirSync(APTerminal.apFolder);

        this.fileSystem.copyFolderRecursiveSync(
          join(this.remote.app.getAppPath(), "dist", "assets", "ap"),
          APTerminal.apLocation
        );
      }
    }, 0);
  }

  /**
   * Returns list of supported analysis types
   */
  public getAnalysisTypes(): APAnalysis[] {
    if (!this.isElectron) {
      return [];
    }

    return List<APAnalysis>(defaultAnalyses).toArray();
  }

  /**
   * Determine if file is supported audio format
   * @param file Filename
   */
  public isSupportedAudioFormat(file: string): boolean {
    if (!this.isElectron) {
      return false;
    }

    return APAnalysis.supportedAudioFormats.some(ext => {
      return extname(file) === `.${ext}`;
    });
  }

  /**
   * Determine if analysis is paused
   */
  public isPaused(): boolean {
    return this.pause;
  }

  /**
   * Unpause analysis
   */
  public unpauseAnalysis(): void {
    this.pause = false;
  }

  /**
   * Pause analysis
   */
  public pauseAnalysis(): void {
    this.pause = true;
  }

  /**
   * Cancel analysis
   */
  public cancelAnalysis(): void {
    this.cancel = true;
  }

  /**
   * Analysis all files. Sends updates back to program through subject.
   * @param analyses Analysis item list
   */
  public analyseFiles(analyses: AnalysisItem[]): Subject<AnalysisProgress> {
    if (!this.isElectron) {
      return;
    }

    this.pause = false;
    this.cancel = false;

    const subject = new Subject<AnalysisProgress>();

    // Run analysis in separate thread
    setTimeout(() => {
      this.recursiveAnalysis(subject, analyses);
    }, 0);

    return subject;
  }

  /**
   * Recursively analyse all analysis items from list
   * @param subject Subject to update
   * @param analyses Analysis item list
   * @param fileNumber Number of file to analyse
   */
  private recursiveAnalysis(
    subject: Subject<AnalysisProgress>,
    analyses: AnalysisItem[],
    fileNumber = 0
  ): void {
    let paused: boolean = this.pause;

    if (analyses.length === 0 || paused || this.cancel) {
      APAnalysis.cleanupTemporaryFiles();
      subject.complete();
      return;
    }

    // Loop over all analysis items
    if (analyses.length > 0) {
      const analysis = analyses.pop();
      const terminal = analysis.spawn();
      let progress = 0;

      subject.next({
        error: false,
        analysis,
        progress,
        fileNumber
      });

      // Handle terminal output
      terminal.stdout.on("data", data => {
        console.debug("Data: ", data.toString());

        paused = this.pause ? true : paused;
        const temp = this.handleTerminalData(data.toString());

        if (temp) {
          progress = temp;
        } else {
          return;
        }

        subject.next({
          error: false,
          analysis,
          progress,
          fileNumber
        });
      });

      // Handle terminal error
      terminal.on("error", err => {
        console.debug("Error: ", err.toString());
        fileNumber += 1;

        paused = this.pause ? true : paused;
        progress = 100;
        subject.next({
          error: true,
          errorDetails: err,
          analysis,
          progress,
          fileNumber
        });
        this.recursiveAnalysis(subject, analyses, fileNumber);
      });

      // Handle terminal closing
      terminal.on("close", code => {
        console.debug("Close: ", code.toString());
        fileNumber += 1;

        paused = this.pause ? true : paused;
        progress = 100;
        const error = code !== APTerminal.OK_CODE;
        subject.next({
          error,
          analysis,
          progress,
          fileNumber
        });
        this.recursiveAnalysis(subject, analyses, fileNumber);
      });
    }
  }

  /**
   * Handle terminal output from analysis
   * @param data Terminal output
   */
  private handleTerminalData(data: string): number {
    const progressReport = "Completed segment";
    const parallelRegex = /INFO.+\/(\d+).+ (\d+) /; // Completed segment ?/? - roughly ? completed
    const serialRegex = /INFO.+(\d+)\/(\d+)$/; // Completed segment ?/?
    const matchLength = 3;
    let isParallel = true;

    // Ignore data if it does not contain progress information
    if (!data.includes(progressReport)) {
      return;
    }

    // Determine what type of search is conducted
    let res = parallelRegex.exec(data);
    if (!res) {
      isParallel = false;
      res = serialRegex.exec(data);
    }

    if (!res || res.length !== matchLength) {
      return;
    }

    // Calculate progress
    let segNumber: number;
    let segTotal: number;

    if (isParallel) {
      segNumber = parseFloat(res[2]);
      segTotal = parseFloat(res[1]);
    } else {
      segNumber = parseFloat(res[1]);
      segTotal = parseFloat(res[2]);
    }

    return (segNumber / segTotal) * 100;
  }
}

export interface AnalysisProgress {
  error: boolean;
  errorDetails?: any;
  analysis: AnalysisItem;
  progress: number;
  fileNumber: number;
}
