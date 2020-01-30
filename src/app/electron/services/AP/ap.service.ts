import { Injectable } from "@angular/core";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { Subject } from "rxjs";
import { APAnalysis } from "../../models/analysis";
import { AnalysisItem } from "../../models/analysisItem";
import APTerminal from "../../models/terminal";
import { ElectronService } from "../electron/electron.service";
import { FileSystemService } from "../file-system/file-system.service";

/**
 * AP Service
 * Handles AP specific logic such as installing AP, and running the analyses.
 */
@Injectable({
  providedIn: "root"
})
export class APService extends ElectronService {
  private inProgress: boolean;
  private cancel: boolean;
  private pause: boolean;
  private subject: Subject<AnalysisProgress>;
  private analyses: AnalysisItem[];
  private fileNumber: number;

  constructor(private fileSystem: FileSystemService) {
    super();

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

    if (!this.inProgress && this.analyses.length !== 0) {
      console.log("unPausing inProgress: ", this.inProgress);

      this.recursiveAnalysis();
    }
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
   * @param analysisItems Analysis item list
   */
  public analyseFiles(
    analysisItems: AnalysisItem[]
  ): Subject<AnalysisProgress> {
    this.pause = false;
    this.cancel = false;
    this.inProgress = false;
    this.subject = new Subject<AnalysisProgress>();
    this.analyses = analysisItems;
    this.fileNumber = 0;

    // Run analysis in separate thread
    setTimeout(() => {
      this.recursiveAnalysis();
    }, 0);

    return this.subject;
  }

  /**
   * Recursively analyse all analysis items from list
   * @param subject Subject to update
   * @param analyses Analysis item list
   * @param fileNumber Number of file to analyse
   */
  private recursiveAnalysis(): void {
    let paused = this.pause;

    if (this.analyses.length === 0 || this.cancel) {
      this.analyses = [];
      APAnalysis.cleanupTemporaryFiles();
      this.subject.complete();
      return;
    }

    // Don't run if paused
    if (paused) {
      return;
    }

    // Loop over all analysis items
    if (this.analyses.length > 0) {
      this.inProgress = true;
      console.log("inProgress: ", this.inProgress);
      const analysis = this.analyses.pop();
      const terminal = analysis.spawn();
      let progress = 0;

      this.subject.next({
        error: false,
        analysis,
        progress,
        fileNumber: this.fileNumber
      });

      // Handle terminal output
      terminal.stdout.on("data", data => {
        if (this.cancel) {
          // Hard kill terminal
          terminal.kill();
          return;
        }

        console.debug("Data: ", data.toString());

        paused = this.pause ? true : paused;
        const temp = this.handleTerminalData(data.toString());

        if (temp) {
          progress = temp;
        } else {
          return;
        }

        this.subject.next({
          error: false,
          analysis,
          progress,
          fileNumber: this.fileNumber
        });
      });

      // Handle terminal error
      terminal.on("error", err => {
        console.debug("Error: ", err.toString());
        this.fileNumber += 1;
        this.inProgress = false;
        console.log("inProgress: ", this.inProgress);

        paused = this.pause ? true : paused;
        progress = 100;
        this.subject.next({
          error: true,
          errorDetails: err,
          analysis,
          progress,
          fileNumber: this.fileNumber
        });
        this.recursiveAnalysis();
      });

      // Handle terminal closing
      terminal.on("close", code => {
        this.fileNumber += 1;
        this.inProgress = false;
        paused = this.pause ? true : paused;
        progress = 100;

        console.debug("Code: ", code);

        this.subject.next({
          error: code ? code !== APTerminal.OK_CODE : false,
          analysis,
          progress,
          fileNumber: this.fileNumber
        });

        this.recursiveAnalysis();
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
