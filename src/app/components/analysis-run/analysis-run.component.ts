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

  RUN = 'run';
  ADD = 'add';
  BACK = 'back';
  CANCEL = 'cancel';

  constructor() {}

  ngOnInit() {
    console.debug('Analysis Run');
    console.debug(this.analysisBatch);
  }

  updateParent(msg: string) {
    this.messageEvent.emit(msg);
  }

  runAnalysis() {
    this.messageEvent.emit('run');
  }
}
