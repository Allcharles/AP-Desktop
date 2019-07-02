import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-analysis-audio',
  templateUrl: './analysis-audio.component.html',
  styleUrls: ['./analysis-audio.component.scss']
})
export class AnalysisAudioComponent implements OnInit {
  audioFiles: [];
  nextEnabled: boolean;

  @Output() messageEvent = new EventEmitter<string[]>();

  constructor() {}

  ngOnInit() {
    this.nextEnabled = false;
  }

  /**
   * Submit empty array to parent to signify goBack condition
   */
  backOnClick() {
    this.messageEvent.emit([]);
  }

  /**
   * Submit element to parent
   */
  nextOnClick() {
    this.messageEvent.emit(this.audioFiles);
  }
}
