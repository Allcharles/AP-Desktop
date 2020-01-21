import { Injectable } from "@angular/core";
import { ElectronService } from "../electron/electron.service";
import { APAnalysis } from "../../models/analysis";
import { AnalysisOptions, AnalysisConfig } from "../../models/analysisHelper";
import { List, fromJS } from "immutable";

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
   * Returns the current analysis
   */
  public getAnalysis(): APAnalysis {
    return this.currentAnalysis;
  }

  /**
   * Returns the list of analyses
   */
  public getAnalyses(): List<APAnalysis> {
    return List(this.analyses);
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
   * @param analysis AP Analysis
   */
  public saveAnalysis(analysis: APAnalysis): void {
    this.analyses.push(analysis);
  }

  /**
   * Remove latest analysis from list of analyses to run
   */
  public destroyAnalysis(): void {
    this.analyses.pop();
  }

  /**
   * Remove all analyses from list
   */
  public destroyAnalyses(): void {
    this.analyses = [];
  }

  /**
   * Retrieve the audio files for the current analysis
   */
  public getAudioFiles(): string[] {
    return this.currentAnalysis.audioFiles.slice();
  }

  /**
   * Set the audio files for the current analysis
   * @param files Audio file paths
   */
  public setAudioFiles(files: string[]): void {
    this.currentAnalysis.audioFiles = files;
  }

  /**
   * Set the output folder for the current analysis
   * @param folder Folder path
   */
  public setOutputFolder(folder: string): void {
    this.currentAnalysis.output = folder;
  }

  /**
   * Get current analysis options
   */
  public getOptions(): AnalysisOptions {
    return fromJS(this.currentAnalysis.options);
  }

  /**
   * Set the analysis options for the current analysis
   * @param options Analysis Options
   */
  public setOptions(options: AnalysisOptions): void {
    this.currentAnalysis.options = options;
  }

  /**
   * Get current analysis config
   */
  public getConfig(): AnalysisConfig {
    return fromJS(this.currentAnalysis.config);
  }

  /**
   * Set the analysis config settings for the current analysis
   * @param config Analysis Config
   */
  public setConfig(config: AnalysisConfig): void {
    this.currentAnalysis.config = config;
  }
}
