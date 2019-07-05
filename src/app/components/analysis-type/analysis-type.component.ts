import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AnalysisGroup } from '../../models/analysis';
import { analysisTypes } from '../../models/analysisTypes';

@Component({
  selector: 'app-analysis-type',
  templateUrl: './analysis-type.component.html',
  styleUrls: ['./analysis-type.component.scss']
})
export class AnalysisTypeComponent implements OnInit {
  @Input() backButton?: boolean;
  @Output() messageEvent = new EventEmitter<AnalysisGroup>();

  analysisTypeOptions: {
    analysis: AnalysisGroup;
    isSelected: boolean;
  }[];

  analysisGroupCurrent: AnalysisGroup;

  nextEnabled: boolean;
  backEnabled: boolean;
  backVisible: boolean;

  constructor() {}

  ngOnInit() {
    this.nextEnabled = false;

    if (this.backButton) {
      this.backEnabled = true;
      this.backVisible = true;
    } else {
      this.backEnabled = false;
      this.backVisible = false;
    }

    this.analysisTypeOptions = analysisTypes.map(option => {
      return {
        analysis: option,
        isSelected: false
      };
    });
  }

  /**
   * Highlight selected analysis type. This also saved the selected analysis type to analysisCurrent.
   * @param id ID of analysis option
   */
  changeSelection(id: number) {
    this.analysisGroupCurrent = this.analysisTypeOptions[id].analysis;
    this.nextEnabled = true;

    this.analysisTypeOptions.map((analysisOption, index) => {
      analysisOption.isSelected = index === id;
    });
  }

  /**
   * Emit back button click
   */
  backOnClick() {
    this.messageEvent.emit(null);
  }

  /**
   * Submit analysis to parent element
   */
  nextOnClick() {
    this.messageEvent.emit(this.analysisGroupCurrent);
  }
}
