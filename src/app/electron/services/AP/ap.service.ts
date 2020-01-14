import { Injectable } from "@angular/core";
import { extname, join } from "path";
import { AnalysisType } from "../../models/analysis";
import { analysisTypes } from "../../models/analysisTypes";
import { ElectronService } from "../electron/electron.service";

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
}
