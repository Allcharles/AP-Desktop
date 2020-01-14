import { Component, OnInit, Input } from "@angular/core";
import { AnalysisType } from "../../../../electron/models/analysis";

@Component({
  selector: "app-analysis-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"]
})
export class OptionsComponent implements OnInit {
  @Input() analysis: AnalysisType;

  constructor() {}

  ngOnInit() {}
}
