import { Injectable } from "@angular/core";
import { extname, join } from "path";
import { AnalysisType, AnalysisItem } from "../../models/analysis";
import { analysisTypes } from "../../models/analysisTypes";
import { ElectronService } from "../electron/electron.service";
import { BehaviorSubject, Subject } from "rxjs";
import { ChildProcess } from "child_process";
import APTerminal from "../../models/terminal";

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
  public getAnalysisTypes(): AnalysisType[] {
    if (!this.isElectron) {
      return [];
    }

    return analysisTypes;
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

  private recursiveAnalysis(
    subject: Subject<AnalysisProgress>,
    analyses: AnalysisItem[],
    fileNumber: number = 1
  ) {
    if (analyses.length === 0) {
      AnalysisType.cleanupTemporaryFiles();
      subject.complete();
      return;
    }

    // Loop over all analysis items
    if (analyses.length > 0) {
      const analysis = analyses.pop();
      const terminal: ChildProcess = analysis.spawn();
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
      terminal.on("error", () => {
        subject.next({
          error: true,
          analysis,
          progress,
          fileNumber
        });
        this.recursiveAnalysis(subject, analyses, fileNumber + 1);
      });

      // Handle terminal closing
      terminal.on("close", code => {
        progress = 100;
        let error = code !== APTerminal.OK_CODE;
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

    console.log("Terminal: ", data);
    console.log("Regex: ", res);
    console.log("segNumber: ", segNumber);
    console.log("segTotal: ", segTotal);

    return (segNumber / segTotal) * 100;
  }
}

export interface AnalysisProgress {
  error: boolean;
  analysis: AnalysisItem;
  progress: number;
  fileNumber: number;
}
