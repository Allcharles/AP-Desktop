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
  public config: AnalysisConfig;
  public configArray: Config[];

  constructor(
    private wizard: WizardService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.config = this.wizard.getConfig();
    console.log(this.config);

    this.configArray = this.generateConfigArray(this.config);
    console.log(this.configArray);
  }

  public nextButton() {
    this.router.navigateByUrl("/analysis/confirm");
  }

  public backButton() {
    this.location.back();
  }

  private generateConfigArray(config: AnalysisConfig): Config[] {
    const output: Config[] = [];

    for (const key of Object.keys(config)) {
      if (typeof config[key] === "object") {
        output.push({
          label: key,
          hasChildren: true,
          value: this.generateConfigArray(config[key] as AnalysisConfig)
        });
      } else {
        output.push({
          label: key,
          hasChildren: false,
          type: typeof config[key] === "number" ? "number" : "text",
          value: config[key] as string
        });
      }
    }

    return output;
  }
}
