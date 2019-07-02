import { Component, OnInit } from '@angular/core';
import { Analysis } from '../../models/analysis';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  SELECT_TYPE = 0;
  SELECT_AUDIO = 1;
  SELECT_OUTPUT = 2;
  OPEN_ADVANCED = 3;
  CHANGE_CONFIG = 4;
  CHANGE_OPTIONS = 5;
  RUN_ANALYSIS = 6;

  analysisList: Analysis[];
  analysisCurrent: Analysis;
  currentStage: number;

  constructor() {}

  ngOnInit() {
    this.currentStage = this.SELECT_TYPE;
  }

  /**
   * Receives the analysis selected by the user through the angular EventEmitter event.
   * This will take the user to the select audio page.
   * @param $event Analysis selected by user
   */
  receiveAnalysis($event: Analysis) {
    this.analysisCurrent = $event;
    this.currentStage = this.SELECT_AUDIO;
  }

  /**
   * Receives the audio files selected by the user through the angular EventEmitter event.
   * This will take the user to the select output folder page.
   * @param $event Audio files selected by user
   */
  receiveAudio($event: string[]) {
    // If no files selected, user has hit the back button
    if ($event.length === 0) {
      this.currentStage = this.SELECT_TYPE;
    } else {
      this.analysisCurrent.setAudioFiles($event);
      this.currentStage = this.SELECT_OUTPUT;
    }
  }
}
