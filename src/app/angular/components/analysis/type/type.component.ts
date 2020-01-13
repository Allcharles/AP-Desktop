import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AnalysisType } from "../../../../electron/models/analysis";
import { APService } from "../../../../electron/services/AP/ap.service";
import { AnalysisEvent } from "../analysis.component";

@Component({
  selector: "app-analysis-type",
  templateUrl: "./type.component.html",
  styleUrls: ["./type.component.scss"]
})
export class TypeComponent implements OnInit {
  @Input() backButton?: boolean;
  @Output() analysisTypeEvent = new EventEmitter<AnalysisTypeEvent>();

  private analysisTypeCurrent: AnalysisType;
  private analysisTypeOptions: AnalysisOption[];

  constructor(private apService: APService) {}

  ngOnInit(): void {
    this.analysisTypeOptions = this.apService
      .getAnalysisTypes()
      .map(analysisType => {
        return {
          analysis: analysisType,
          isSelected: false
        } as AnalysisOption;
      });
  }

  /**
   * Set the selected analysis type
   * @param id ID of analysis option
   */
  changeSelection(id: number) {
    this.analysisTypeCurrent = this.analysisTypeOptions[id].analysis;
    this.analysisTypeOptions.map((analysisOption, index) => {
      analysisOption.isSelected = index === id;
    });

    this.analysisTypeEvent.emit({
      output: this.analysisTypeCurrent,
      isValid: true
    });
  }
}

interface AnalysisTypeEvent extends AnalysisEvent {
  output: AnalysisType;
}

interface AnalysisOption {
  analysis: AnalysisType;
  isSelected: boolean;
}
