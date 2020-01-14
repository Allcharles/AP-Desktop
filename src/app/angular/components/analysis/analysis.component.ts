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
    if (this.currentStage === Stages.SelectOutput) {
      this.currentStage = Stages.RunAnalysis;
    } else if (this.currentStage === Stages.RunAnalysis) {
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
    if (this.currentStage === Stages.RunAnalysis) {
      this.currentStage = Stages.SelectOutput;
    } else if (this.currentStage === Stages.SelectType) {
      this.currentStage = Stages.RunAnalysis;
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
    console.log($event);

    this.isValid = $event.isValid;
    this.currentAnalysis.audioFiles = $event.output;
  }
}

export interface AnalysisEvent {
  output: any;
  isValid: boolean;
}

enum Stages {
  SelectType,
  SelectAudio,
  SelectOutput,
  OpenAdvanced,
  ChangeConfig,
  ChangeOptions,
  RunAnalysis,
  DisplayOutput
}
