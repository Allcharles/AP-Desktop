import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { APAnalysis } from "../../../../electron/models/analysis";
import {
  AnalysisConfig,
  isAnalysisConfig
} from "../../../../electron/models/analysisHelper";
import { WizardService } from "../../../../electron/services/wizard/wizard.service";
import { Config } from "./config/config.component";

@Component({
  selector: "app-config-editor",
  templateUrl: "./config-editor.component.html",
  styleUrls: ["./config-editor.component.scss"]
})
export class ConfigEditorComponent implements OnInit {
  public config: Config[];
  private analysis: APAnalysis;

  constructor(
    private wizard: WizardService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.analysis = this.wizard.getAnalysis();
    this.reset();
  }

  public nextButton(): void {
    this.analysis.config = this.convertToAnalysisConfig(this.config);
    this.router.navigateByUrl("/analysis/confirm");
  }

  public backButton(): void {
    this.location.back();
  }

  public reset(): void {
    this.config = this.convertToConfigOption(this.analysis.config);
  }

  /**
   * Convert config array to object
   * @param config Config Array
   */
  private convertToAnalysisConfig(config: Config[]): AnalysisConfig {
    const output: AnalysisConfig = [];

    for (const option of config) {
      if (option.value instanceof Array) {
        output.push({
          key: option.label,
          value: this.convertToAnalysisConfig(option.value)
        });
      } else {
        output.push({ key: option.label, value: option.value });
      }
    }

    return output;
  }

  /**
   * Convert config object to array
   * @param config Config Object
   */
  private convertToConfigOption(config: AnalysisConfig): Config[] {
    const output: Config[] = [];

    for (const option of config) {
      if (isAnalysisConfig(option.value)) {
        output.push({
          label: option.key,
          hasChildren: true,
          value: this.convertToConfigOption(option.value)
        });
      } else {
        output.push({
          label: option.key,
          hasChildren: false,
          type: typeof option.value === "number" ? "number" : "text",
          value: option.value.toString()
        });
      }
    }

    return output;
  }
}
