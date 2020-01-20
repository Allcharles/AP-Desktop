import { Component, OnInit } from "@angular/core";
import { AnalysisItem } from "../../../electron/models/analysisItem";
import { APAnalysis } from "../../../electron/models/analysis";
import {
  AnalysisOptions,
  AnalysisConfig
} from "../../../electron/models/analysisHelper";
import { Option } from "./advanced/option/option.component";
import { Config } from "./advanced/config/config.component";
import {
  getOptionsArray,
  getConfigArray,
  convertToConfig,
  convertToOptions
} from "./advanced/advanced.component";

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrls: ["./analysis.component.scss"]
})
export class AnalysisComponent implements OnInit {
  public analyses: AnalysisItem[];
  public analysisBatch: APAnalysis[];
  public currentAnalysis: APAnalysis;
  public currentStage: Stages;
  public originalConfig: AnalysisConfig;
  public originalOptions: AnalysisOptions;
  public stages = Stages;
  public isValid: boolean;

  public currentSelection: {
    analysisType?: APAnalysis;
    audioFiles?: string[];
    outputFolder?: string;
    options?: Option[];
    config?: Config[];
  };

  constructor() {}

  ngOnInit(): void {
    this.currentStage = Stages.SelectType;
    this.analyses = [];
    this.analysisBatch = [];
    this.currentSelection = {};
    this.isValid = false;

    // TODO Deep Equality check on config -> originalConfig + options to check if showActivated is true
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
    if (this.currentStage === Stages.Advanced) {
      this.analysisBatch.push(this.currentAnalysis);
    }

    if (this.currentStage === Stages.Confirmation) {
      this.currentStage = Stages.SelectType;
    } else {
      this.currentStage++;
    }

    if (this.currentAnalysis) {
      // Update config and options
      if (this.currentSelection.config && this.currentSelection.options) {
        this.currentAnalysis.config = convertToConfig(
          this.currentSelection.config
        );

        this.currentAnalysis.options = convertToOptions(
          this.currentSelection.options
        );
      }

      this.currentSelection = {
        analysisType: this.currentAnalysis,
        audioFiles: this.currentAnalysis.audioFiles,
        outputFolder: this.currentAnalysis.output,
        options: getOptionsArray(this.currentAnalysis.options),
        config: getConfigArray(this.currentAnalysis.config)
      };

      console.log(this.currentSelection);
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

    if (this.currentStage === Stages.SelectType) {
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

    if (this.currentAnalysis) {
      this.originalConfig = this.copyObject(
        this.currentAnalysis.config
      ) as AnalysisConfig;
      this.originalOptions = this.copyObject(
        this.currentAnalysis.options
      ) as AnalysisOptions;
    }
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
    this.currentAnalysis.output = $event.output;
  }

  /**
   * Cancel all analyses
   */
  public resetProgress(): void {
    this.analyses = [];
    this.analysisBatch = [];
    this.currentStage = Stages.SelectType;
  }

  /**
   * Generate list of analyses and show output
   */
  public runAnalysis(): void {
    this.analysisBatch.map(analysisType => {
      this.analyses = this.analyses.concat(analysisType.generateBatch());
    });
    this.currentStage = Stages.DisplayOutput;
  }

  /**
   * Correctly copy an object such that the new object does not affect the original
   * @param obj Object
   */
  private copyObject(obj: object): object {
    const copy = {};

    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        if (obj[attr] instanceof Array) {
          copy[attr] = (obj[attr] as Array<any>).slice();
        } else if (typeof obj[attr] === "object") {
          copy[attr] = this.copyObject(obj[attr]);
        } else {
          copy[attr] = obj[attr];
        }
      }
    }

    return copy;
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
  Advanced,
  Confirmation,
  DisplayOutput
}
