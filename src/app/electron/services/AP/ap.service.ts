import { Injectable } from "@angular/core";
import { extname, join, basename } from "path";
import { APAnalysis } from "../../models/analysis";
import { AnalysisItem } from "../../models/analysisItem";
import { defaultAnalyses } from "../../models/defaultAnalyses";
import { ElectronService } from "../electron/electron.service";
import { Subject } from "rxjs";
import APTerminal from "../../models/terminal";
import {
  existsSync,
  mkdirSync,
  lstatSync,
  readdirSync,
  copyFileSync
} from "fs";

@Injectable({
  providedIn: "root"
})
export class APService extends ElectronService {
  public readonly supportedAudioFormats = [
    "wav",
    "mp3",
    "pcm",
    "aiff",
    "aac",
    "ogg",
    "wma",
    "flac",
    "alac",
    "wma"
  ];

  constructor() {
    super();

    if (!this.isElectron) {
      return;
    }

    setTimeout(() => {
      //TODO Add a check for the version AP to determine if an update is required

      // Download AP to client computer
      if (!existsSync(APTerminal.apFolder)) {
        mkdirSync(APTerminal.apFolder);

        this.copyFolderRecursiveSync(
          join(this.remote.app.getAppPath(), "dist", "assets", "ap"),
          APTerminal.apLocation
        );
      }
    }, 0);
  }

  /**
   * Returns the default output folder
   */
  public get defaultOutputFolder(): string {
    if (!this.isElectron) {
      return "";
    } else {
      return join(this.remote.app.getPath("documents"), "AP Desktop");
    }
  }

  /**
   * Returns list of supported analysis types
   */
  public getAnalysisTypes(): APAnalysis[] {
    if (!this.isElectron) {
      return [];
    }

    return defaultAnalyses;
  }

  /**
   * Determine if file is supported audio format
   * @param file Filename
   */
  public isSupportedAudioFormat(file: string): boolean {
    if (!this.isElectron) {
      return false;
    }

    return this.supportedAudioFormats.some(ext => {
      return extname(file) === `.${ext}`;
    });
  }

  /**
   * Analysis all files. Sends updates back to program through subject.
   * @param analyses Analysis item list
   */
  public analyseFiles(analyses: AnalysisItem[]): Subject<AnalysisProgress> {
    if (!this.isElectron) {
      return;
    }

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
    fileNumber = 1
  ): void {
    if (analyses.length === 0) {
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
        progress = 100;
        subject.next({
          error: true,
          errorDetails: err,
          analysis,
          progress,
          fileNumber
        });
        this.recursiveAnalysis(subject, analyses, fileNumber + 1);
      });

      // Handle terminal closing
      terminal.on("close", code => {
        progress = 100;
        const error = code !== APTerminal.OK_CODE;
        subject.next({
          error,
          analysis,
          progress,
          fileNumber
        });
        this.recursiveAnalysis(subject, analyses, fileNumber + 1);
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

  /**
   * Copy folder and its files recursively
   * @param source Source folder path
   * @param target Output folder path
   */
  private copyFolderRecursiveSync(source: string, target: string): void {
    let files = [];

    //check if folder needs to be created or integrated
    const targetFolder = join(target, basename(source));
    if (!existsSync(targetFolder)) {
      mkdirSync(targetFolder);
    }

    //copy
    if (lstatSync(source).isDirectory()) {
      files = readdirSync(source);

      for (const file of files) {
        const curSource = join(source, file);
        if (lstatSync(curSource).isDirectory()) {
          this.copyFolderRecursiveSync(curSource, targetFolder);
        } else {
          let targetFile = targetFolder;

          //if target is a directory a new file with the same name will be created
          if (existsSync(targetFolder)) {
            if (lstatSync(targetFolder).isDirectory()) {
              targetFile = join(targetFolder, basename(curSource));
            }
          }

          copyFileSync(curSource, targetFile);
        }
      }
    }
  }
}

export interface AnalysisProgress {
  error: boolean;
  errorDetails?: any;
  analysis: AnalysisItem;
  progress: number;
  fileNumber: number;
}
