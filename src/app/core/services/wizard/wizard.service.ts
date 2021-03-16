import { Injectable } from "@angular/core";
import { List } from "immutable";
import { extname } from "path";
import { Subject } from "rxjs";
import { APAnalysis } from "../../models/analysis";
import { defaultAnalyses } from "../../defaultAnalyses";
import { ElectronService } from "../electron/electron.service";
import { FileSystemService } from "../file-system/file-system.service";

/**
 * Wizard Service
 * Handles analysis creation.
 */
@Injectable({
  providedIn: "root",
})
export class WizardService extends ElectronService {
  private analyses: APAnalysis[] = [];
  private currentAnalysis: APAnalysis;

  constructor(private fileSystem: FileSystemService) {
    super();
  }

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
    return APAnalysis.supportedAudioFormats.some((ext) => {
      return extname(file) === `.${ext}`;
    });
  }

  /**
   * Returns list of supported analysis types
   */
  public getAnalysisTypes(): Subject<APAnalysis[]> {
    const subject = new Subject<APAnalysis[]>();
    const analysisTypes: APAnalysis[] = [];
    const numTemplates = defaultAnalyses.length;
    let completedTypes = 0;

    // For each analysis type
    defaultAnalyses.forEach((analysisType) => {
      function getAPAnalysis(template: string) {
        return new APAnalysis(
          analysisType.type,
          analysisType.label,
          analysisType.description,
          { template, changes: analysisType.configFile.changes },
          analysisType.options
        );
      }

      const sortAnalysesByLabel = (a: APAnalysis, b: APAnalysis) => {
        if (a.label === b.label) {
          return 0;
        }
        return a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1;
      };

      // Locate config file
      this.fileSystem.locateFile(
        APAnalysis.apConfigDirectory,
        analysisType.configFile.template,
        (err, files) => {
          completedTypes++;

          if (err || files.length === 0) {
            // Skip if config file not found
            console.error(
              "Failed to find config file: " + analysisType.configFile.template
            );
            console.error(err);
          } else {
            // Add analysis to list
            const template = files[0];
            analysisTypes.push(getAPAnalysis(template));
          }

          // If all analyses found, complete subscription
          if (completedTypes === numTemplates) {
            analysisTypes.sort(sortAnalysesByLabel);
            subject.next(analysisTypes);
            subject.complete();
          }
        }
      );
    });

    return subject;
  }
}
