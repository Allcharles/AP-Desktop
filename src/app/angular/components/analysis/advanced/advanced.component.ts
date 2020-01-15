import { Component, OnInit, Input } from "@angular/core";
import { AnalysisType } from "../../../../electron/models/analysis";

@Component({
  selector: "app-analysis-advanced",
  template: `
    <div class="pt-3 pb-3">
      <app-analysis-options [analysis]="analysis"></app-analysis-options>
    </div>
    <div class="pt-3 pb-5">
      <app-analysis-config [analysis]="analysis"></app-analysis-config>
    </div>

    <ng-content></ng-content>
  `
})
export class AdvancedComponent implements OnInit {
  @Input() analysis: AnalysisType;

  constructor() {}

  ngOnInit(): void {}
}
