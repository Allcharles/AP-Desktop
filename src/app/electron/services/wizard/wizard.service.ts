import { Injectable } from "@angular/core";
import { ElectronService } from "../electron/electron.service";
import { APAnalysis } from "../../models/analysis";
import { AnalysisOptions, AnalysisConfig } from "../../models/analysisHelper";

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
   * Save analysis to service
   * @param analysis AP Analysis
   */
  public createAnalysis(analysis: APAnalysis) {
    this.currentAnalysis = analysis;
  }

  /**
   * Save analysis to list of analyses to run
   * @param analysis AP Analysis
   */
  public saveAnalysis(analysis: APAnalysis) {
    this.analyses.push(analysis);
  }

  /**
   * Remove latest analysis from list of analyses to run
   */
  public destroyAnalysis() {
    this.analyses.pop();
  }

  /**
   * Remove all analyses from list
   */
  public destroyAnalyses() {
    this.analyses = [];
  }

  /**
   * Set the audio files for the current analysis
   * @param files Audio file paths
   */
  public setAudioFiles(files: string[]) {
    this.currentAnalysis.audioFiles = files;
  }

  /**
   * Set the output folder for the current analysis
   * @param folder Folder path
   */
  public setOutputFolder(folder: string) {
    this.currentAnalysis.output = folder;
  }

  /**
   * Set the analysis options for the current analysis
   * @param options Analysis Options
   */
  public setOptions(options: AnalysisOptions) {
    this.currentAnalysis.options = options;
  }

  /**
   * Set the analysis config settings for the current analysis
   * @param config Analysis Config
   */
  public setConfig(config: AnalysisConfig) {
    this.currentAnalysis.config = config;
  }
}
