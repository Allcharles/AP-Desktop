import { Injectable } from "@angular/core";
import { List } from "immutable";
import { APAnalysis } from "../../models/analysis";
import { APService } from "../AP/ap.service";

@Injectable({
  providedIn: "root"
})
export class WizardService extends APService {
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
}
