import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AnalysisItem, AnalysisGroup } from '../../models/analysis';
import { ChildProcess } from 'child_process';
import APTerminal from '../../models/terminal';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {
  @Input() analyses: AnalysisItem[];

  totalFiles: number;
  completeFiles: number;
  currentProgress: number;
  currentAnalysis: AnalysisItem;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    console.debug('Analyses to run');
    console.debug(this.analyses);
    this.totalFiles = this.analyses.length;
    this.completeFiles = 0;
    this.currentProgress = 0;
    this.analyseFiles();
  }

  /**
   * Round the current progress value for display in the progress bar
   * @returns Floored value of currentProgress
   */
  displayCurrentProgress() {
    return Math.floor(this.currentProgress);
  }

  /**
   * Analysis files recursively until all are done.
   * TODO Add support for serial analyses
   */
  analyseFiles() {
    // If more files exist, continue analysis
    if (this.analyses.length === 0) {
      AnalysisGroup.cleanupTemporaryFiles();
      return;
    }

    this.currentAnalysis = this.analyses.pop();
    this.currentProgress = 0;
    this.runAnalysis();
    this.ref.detectChanges();
  }

  /**
   * Run file analysis
   */
  private runAnalysis() {
    const terminal: ChildProcess = this.currentAnalysis.spawn();

    terminal.stdout.on('data', data => {
      const PROGRESS_REPORT = 'Completed segment';
      const PARALLEL_REGEX: RegExp = /INFO.+\/(\d+).+ (\d+) /; // Completed segment ?/? - roughly ? completed
      const SERIAL_REGEX: RegExp = /INFO.+(\d+)\/(\d+)$/; // Completed segment ?/?
      const PARALLEL_MATCH_LENGTH = 3;
      const SERIAL_MATCH_LENGTH = 3;

      // Ignore if data does not contain progress information
      if (!data.includes(PROGRESS_REPORT)) {
        return;
      }

      let res = PARALLEL_REGEX.exec(data.toString());
      console.debug(res);
      // If not parallel, try serial
      if (res === null) {
        console.debug(data.toString());
        res = SERIAL_REGEX.exec(data.toString());
        if (res === null) {
          return;
        } else {
          console.debug('Serial Analysis');
        }
      } else {
        console.debug('Parallel Analysis');
      }
      // Calculate progress
      let segNo: number, segTotal: number;
      if (res.length === PARALLEL_MATCH_LENGTH) {
        // Parallel regex has segment number after the total number of segments
        segNo = parseFloat(res[2]);
        segTotal = parseFloat(res[1]);
      } else if (res.length === SERIAL_MATCH_LENGTH) {
        segNo = parseFloat(res[1]);
        segTotal = parseFloat(res[2]);
      }
      this.currentProgress = (segNo / segTotal) * 100;
      this.ref.detectChanges();
    });

    terminal.on('error', err => {
      // Log error
      console.error('Analysis Error');
      console.error(this.currentAnalysis);
      console.error(err);
      this.currentProgress = 100;
      this.completeFiles++;
      this.ref.detectChanges();
      this.analyseFiles();
    });

    terminal.on('close', code => {
      // Log any errors
      if (code !== APTerminal.OK_CODE) {
        console.error(
          'AP Terminal Error Message: ' + APTerminal.ErrorCodes[code]
        );
      }
      this.currentProgress = 100;
      this.completeFiles++;
      this.ref.detectChanges();
      this.analyseFiles();
    });
  }
}
