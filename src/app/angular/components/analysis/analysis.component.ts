import { Component, OnInit } from "@angular/core";
import { AnalysisItem, AnalysisType } from "../../../electron/models/analysis";

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrls: ["./analysis.component.scss"]
})
export class AnalysisComponent implements OnInit {
  public analyses: AnalysisItem[];
  public analysisBatch: AnalysisType[];
  public currentAnalysis: AnalysisType;
  public currentStage: Stages;
  public stages = Stages;
  public isValid: boolean;

  public currentSelection: {
    analysisType?: AnalysisType;
    audioFiles?: string[];
    outputFolder?: string;
  };

  constructor() {}

  ngOnInit(): void {
    this.currentStage = Stages.SelectType;
    this.analyses = [];
    this.analysisBatch = [];
    this.currentSelection = {};
    this.isValid = false;
  }

  /**
   * Display an element if it is the current stage
   * @param expectedStage Stage to check against current stage
   * @returns True if stage should show
   */
  public showStage(expectedStage: Stages): boolean {
    return this.currentStage === expectedStage;
  }

  /**
   * Go to next stage
   */
  public next(): void {
    // Push current analysis to analysis batch before showing confirmation
    if (this.currentStage === Stages.SelectFolder) {
      this.analysisBatch.push(this.currentAnalysis);
    }

    if (this.currentStage === Stages.SelectFolder) {
      this.currentStage = Stages.Confirmation;
    } else if (this.currentStage === Stages.Confirmation) {
      this.currentStage = Stages.SelectType;
    } else {
      this.currentStage++;
    }

    if (this.currentAnalysis) {
      this.currentSelection = {
        analysisType: this.currentAnalysis,
        audioFiles: this.currentAnalysis.audioFiles,
        outputFolder: this.currentAnalysis.outputFolder
      };
    } else {
      this.currentSelection = {};
    }
  }

  /**
   * Go to previous stage
   */
  public back(): void {
    // Pop current analysis from analysis batch if backing out of showing confirmation
    if (this.currentStage === Stages.Confirmation) {
      this.analysisBatch.pop();
    }

    if (this.currentStage === Stages.Confirmation) {
      this.currentStage = Stages.SelectFolder;
    } else if (this.currentStage === Stages.SelectType) {
      this.currentStage = Stages.Confirmation;
    } else {
      this.currentStage--;
    }
  }

  /**
   * Receive analysis type
   * @param $event Analysis type event
   */
  public receiveAnalysisType($event: AnalysisEvent): void {
    this.isValid = $event.isValid;
    this.currentAnalysis = $event.output;
  }

  /**
   * Receive analysis audio files
   * @param $event Audio file event
   */
  public receiveAudio($event: AnalysisEvent): void {
    this.isValid = $event.isValid;
    this.currentAnalysis.audioFiles = $event.output;
  }

  /**
   * Receive analysis audio files
   * @param $event Audio file event
   */
  public receiveOutputFolder($event: AnalysisEvent): void {
    this.isValid = $event.isValid;
    this.currentAnalysis.outputFolder = $event.output;
  }

  /**
   * Cancel all analyses
   */
  public cancelAnalysis(): void {
    this.analyses = [];
    this.analysisBatch = [];
    this.currentStage = Stages.SelectType;
  }

  /**
   * Generate list of analyses and show output
   */
  public runAnalysis(): void {
    this.analysisBatch.map(analysisType => {
      this.analyses.push.apply(this.analyses, analysisType.generateBatch());
    });
    this.currentStage = Stages.DisplayOutput;
  }
}

export interface AnalysisEvent {
  output: any;
  isValid: boolean;
}

enum Stages {
  SelectType,
  SelectAudio,
  SelectFolder,
  OpenAdvanced,
  ChangeConfig,
  ChangeOptions,
  Confirmation,
  DisplayOutput
}

export interface AnalysisEvent {
  output: any;
  isValid: boolean;
}
