import { Component, OnInit, Input } from "@angular/core";
import { AnalysisType } from "../../../../electron/models/analysis";

@Component({
  selector: "app-analysis-advanced",
  templateUrl: "./advanced.component.html",
  styleUrls: ["./advanced.component.scss"]
})
export class AdvancedComponent implements OnInit {
  @Input() analysis: AnalysisType;

  constructor() {}

  ngOnInit() {}
}
