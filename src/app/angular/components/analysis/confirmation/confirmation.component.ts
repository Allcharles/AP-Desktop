import { Component, Input, OnInit } from "@angular/core";
import { APAnalysis } from "../../../../electron/models/analysis";

@Component({
  selector: "app-analysis-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.scss"]
})
export class ConfirmationComponent implements OnInit {
  @Input() analysisBatch: APAnalysis[];

  constructor() {}

  ngOnInit(): void {}
}
