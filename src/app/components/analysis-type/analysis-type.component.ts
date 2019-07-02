import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Analysis } from '../../models/analysis';
import { analysisTypes } from '../../models/AnalysisTypes';

@Component({
  selector: 'app-analysis-type',
  templateUrl: './analysis-type.component.html',
  styleUrls: ['./analysis-type.component.scss']
})
export class AnalysisTypeComponent implements OnInit {
  constructor() {}
  analysisOptions: {
    analysis: Analysis;
    isSelected: boolean;
  }[];

  analysisCurrent: Analysis;

  nextEnabled: boolean;
  backEnabled: boolean;
  backVisible: boolean;

  @Output() messageEvent = new EventEmitter<Analysis>();

  ngOnInit() {
    this.nextEnabled = false;
    this.backEnabled = false;
    this.backVisible = false;

    this.analysisOptions = analysisTypes.map(option => {
      return {
        analysis: option,
        isSelected: false
      };
    });
  }

  changeSelection(id: number) {
    this.analysisCurrent = this.analysisOptions[id].analysis;
    this.nextEnabled = true;

    this.analysisOptions.map((analysisOption, index) => {
      analysisOption.isSelected = index === id;
    });
  }

  nextOnClick() {
    this.messageEvent.emit(this.analysisCurrent);
  }
}
