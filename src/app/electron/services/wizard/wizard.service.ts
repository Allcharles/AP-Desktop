import { Injectable } from "@angular/core";
import { List } from "immutable";
import { extname } from "path";
import { APAnalysis } from "../../models/analysis";
import { defaultAnalyses } from "../../models/defaultAnalyses";
import { ElectronService } from "../electron/electron.service";

/**
 * Wizard Service
 * Handles analysis creation.
 */
@Injectable({
  providedIn: "root"
})
export class WizardService extends ElectronService {
  /**
   * List of analyses to run
   */
  private analyses: APAnalysis[] = [];

  /**
   * Current analysis being constructed
   */
  private currentAnalysis: APAnalysis;

  /**
   * Returns the current analysis. Undefined if no analysis available
   */
  public getAnalysis(): APAnalysis {
    return this.currentAnalysis;
  }

  /**
   * Returns the list of analyses
   */
  public getAnalyses(): APAnalysis[] {
    return List(this.analyses).toArray();
  }

  /**
   * Save analysis to service
   * @param analysis AP Analysis
   */
  public createAnalysis(analysis: APAnalysis): void {
    this.currentAnalysis = analysis;
  }

  /**
   * Save analysis to list of analyses to run
   */
  public saveAnalysis(): void {
    this.analyses.push(this.currentAnalysis);
    this.currentAnalysis = undefined;
  }

  /**
   * Remove latest analysis from list of analyses to run
   */
  public unSaveAnalysis(): void {
    this.currentAnalysis = this.analyses.pop();
  }

  /**
   * Remove all analyses from list
   */
  public destroyAnalyses(): void {
    this.analyses = [];
    this.currentAnalysis = undefined;
  }

  /**
   * Determine if file is supported audio format
   * @param file Filename
   */
  public isSupportedAudioFormat(file: string): boolean {
    return APAnalysis.supportedAudioFormats.some(ext => {
      return extname(file) === `.${ext}`;
    });
  }

  /**
   * Returns list of supported analysis types
   */
  public getAnalysisTypes(): APAnalysis[] {
    return List<APAnalysis>(defaultAnalyses).toArray();
  }
}
