import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-analysis-audio',
  templateUrl: './analysis-audio.component.html',
  styleUrls: ['./analysis-audio.component.scss']
})
export class AnalysisAudioComponent implements OnInit {
  audioFiles: [];

  @Output() messageEvent = new EventEmitter<string[]>();

  constructor() {}

  ngOnInit() {}

  sendAudio() {
    this.messageEvent.emit(this.audioFiles);
  }
}
