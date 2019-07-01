import { Component, OnInit } from '@angular/core';
import { analysisTypes } from '../../models/AnalysisTypes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  analysisOptions: { id: string; label: string; isSelected: boolean }[];

  constructor() {}

  ngOnInit() {
    this.analysisOptions = analysisTypes.map(option => {
      return { ...option, isSelected: false };
    });
  }

  changeSelection(id: string) {
    this.analysisOptions.map(analysisOption => {
      analysisOption.isSelected = analysisOption.id === id;
    });
  }
}
