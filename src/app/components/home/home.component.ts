import { Component, OnInit } from '@angular/core';
import { analysisTypes } from '../../models/AnalysisTypes';
import { Analysis } from '../../models/analysis';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  analysisOptions: {
    analysis:Analysis,
    isSelected: boolean;
  }[];

  analysisList:Analysis[];
  analysisCurrent:Analysis;

  nextEnabled:boolean;
  backEnabled:boolean;
  backVisible:boolean;

  constructor() {}

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
    console.debug(this.analysisOptions);
    console.debug(this.analysisList);
    console.debug(this.analysisCurrent);
  }
}
