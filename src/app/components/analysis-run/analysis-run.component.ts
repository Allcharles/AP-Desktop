import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AnalysisGroup } from '../../models/analysis';

@Component({
  selector: 'app-analysis-run',
  templateUrl: './analysis-run.component.html',
  styleUrls: ['./analysis-run.component.scss']
})
export class AnalysisRunComponent implements OnInit {
  @Input() analysisBatch: AnalysisGroup[];
  @Output() messageEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  runAnalysis() {
    this.messageEvent.emit('run');
  }
}
