import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AnalysisConfig } from "../../../../electron/models/analysisHelper";
import { WizardService } from "../../../../electron/services/wizard/wizard.service";
import { Config } from "./config/config.component";

@Component({
  selector: "app-config-editor",
  templateUrl: "./config-editor.component.html",
  styleUrls: ["./config-editor.component.scss"]
})
export class ConfigEditorComponent implements OnInit {
  public config: Config[];

  constructor(
    private wizard: WizardService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.reset();
  }

  public nextButton() {
    this.wizard.setConfig(this.generateConfigObject(this.config));
    this.router.navigateByUrl("/analysis/confirm");
  }

  public backButton() {
    this.location.back();
  }

  public reset() {
    const analysisConfig = this.wizard.getConfig();
    this.config = this.generateConfigArray(analysisConfig);
  }

  /**
   * Convert config array to object
   * @param config Config Array
   */
  private generateConfigObject(config: Config[]): AnalysisConfig {
    const output: AnalysisConfig = {};

    for (const option of config) {
      if (option.value instanceof Array) {
        output[option.label] = this.generateConfigObject(option.value);
      } else {
        output[option.label] = option.value;
      }
    }

    return output;
  }

  /**
   * Convert config object to array
   * @param config Config Object
   */
  private generateConfigArray(config: any): Config[] {
    const output: Config[] = [];

    config.keySeq().forEach((key: string) => {
      const option = config.get(key);

      if (typeof option === "object") {
        output.push({
          label: key,
          hasChildren: true,
          value: this.generateConfigArray(option as AnalysisConfig)
        });
      } else {
        output.push({
          label: key,
          hasChildren: false,
          type: typeof option === "number" ? "number" : "text",
          value: option as string
        });
      }
    });

    return output;
  }
}
