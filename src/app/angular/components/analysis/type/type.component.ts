import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { AnalysisType } from "../../../../electron/models/analysis";
import { APService } from "../../../../electron/services/AP/ap.service";

@Component({
  selector: "app-analysis-type",
  templateUrl: "./type.component.html",
  styleUrls: ["./type.component.scss"]
})
export class TypeComponent implements OnInit {
  @Input() backButton?: boolean;
  @Output() analysisTypeEvent = new EventEmitter<AnalysisType>();

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

    this.analysisTypeEvent.emit(this.analysisTypeCurrent);
  }
}

interface AnalysisOption {
  analysis: AnalysisType;
  isSelected: boolean;
}
