import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AnalysisType } from "../../../../electron/models/analysisType";
import { APService } from "../../../../electron/services/AP/ap.service";
import { AnalysisEvent } from "../analysis.component";

@Component({
  selector: "app-analysis-type",
  templateUrl: "./type.component.html",
  styleUrls: ["./type.component.scss"]
})
export class TypeComponent implements OnInit {
  @Input() analysisType?: AnalysisType;
  @Output() analysisTypeEvent = new EventEmitter<AnalysisTypeEvent>();

  public analysisTypeOptions: AnalysisOption[];
  private analysisTypeCurrent: AnalysisType;

  constructor(private ap: APService) {}

  ngOnInit(): void {
    this.analysisTypeCurrent = this.analysisType;

    this.analysisTypeOptions = this.ap.getAnalysisTypes().map(analysisType => {
      return {
        analysis: analysisType,
        isSelected: this.analysisType
          ? analysisType.label === this.analysisType.label
          : false
      } as AnalysisOption;
    });

    this.analysisTypeEvent.emit({
      output: this.analysisTypeCurrent,
      isValid: !!this.analysisTypeCurrent
    });
  }

  /**
   * Set the selected analysis type
   * @param id ID of analysis option
   */
  protected changeSelection(id: number): void {
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
