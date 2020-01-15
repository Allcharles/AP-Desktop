import { Component, OnInit, Input } from "@angular/core";
import { AnalysisType } from "../../../../../electron/models/analysis";
import { Config } from "../config-option/config-option.component";

@Component({
  selector: "app-analysis-config",
  template: `
    <div class="container">
      <div class="card shadow">
        <div class="card-header">
          Configuration Editor
        </div>
        <div class="card-body">
          <app-config-option [config]="config"></app-config-option>
        </div>
      </div>
    </div>
  `
})
export class ConfigComponent implements OnInit {
  @Input() analysis: AnalysisType;

  public config: Config[];

  constructor() {}

  ngOnInit(): void {
    this.config = this.convertToArray(this.analysis.getConfig());
  }

  convertToArray(config: object): Config[] {
    const output: Config[] = [];

    for (const key in config) {
      if (config.hasOwnProperty(key)) {
        const hasChildren = typeof config[key] === "object";
        let value: string | number | Config[];

        if (hasChildren) {
          value = this.convertToArray(config[key]);
        } else {
          value = config[key];
        }

        output.push({ key, value, hasChildren });
      }
    }

    return output;
  }
}
