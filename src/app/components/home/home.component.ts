import { Component, OnInit } from '@angular/core';
import { analysisTypes } from '../../models/AnalysisTypes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  analysisOptions: {
    label: string;
    description: string;
    isSelected: boolean;
  }[];

  constructor() {}

  ngOnInit() {
    this.analysisOptions = analysisTypes.map(option => {
      return {
        label: option.getLabel(),
        description: option.getDescription(),
        isSelected: false
      };
    });
  }

  changeSelection(id: number) {
    this.analysisOptions.map((analysisOption, index) => {
      analysisOption.isSelected = index === id;
    });
  }
}
