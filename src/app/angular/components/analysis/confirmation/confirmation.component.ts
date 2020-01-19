import { Component, Input, OnInit } from "@angular/core";
import { AnalysisType } from "../../../../electron/models/analysisType";

@Component({
  selector: "app-analysis-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.scss"]
})
export class ConfirmationComponent implements OnInit {
  @Input() analysisBatch: AnalysisType[];

  constructor() {}

  ngOnInit(): void {}
}
