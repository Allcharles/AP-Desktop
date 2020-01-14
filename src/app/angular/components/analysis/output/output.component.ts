import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AnalysisItem } from "src/app/electron/models/analysis";

@Component({
  selector: "app-analysis-output",
  templateUrl: "./output.component.html",
  styleUrls: ["./output.component.scss"]
})
export class OutputComponent implements OnInit {
  @Input() analyses: AnalysisItem[];
  @Output() onComplete = new EventEmitter<any>();

  public totalFiles: number;
  public completeFiles: number;
  public currentProgress: number;
  public currentAnalysis: AnalysisItem;
  public running: boolean;
  public pause: boolean;

  constructor() {}

  ngOnInit(): void {
    console.log("Analyses to run");
    console.log(this.analyses);

    this.totalFiles = this.analyses.length;
    this.completeFiles = 0;
    this.currentProgress = 0;
    this.pause = false;
    this.running = false;
    this.analyseFiles();
  }

  /**
   * Toggle pause analysis after currently running file is finished.
   */
  public pauseAnalysis(): void {
    this.pause = !this.pause;

    // If unpause and analysis is no longer running
    if (!this.pause && !this.running) {
      this.analyseFiles();
    }
  }

  /**
   * Resets analyses and sends user back to analysis selection page
   */
  public stopAnalysis(): void {
    this.analyses = [];
    this.newAnalysis();
  }

  /**
   * Round the current progress value for display in the progress bar
   * @returns Floored value of currentProgress
   */
  public displayCurrentProgress() {
    return Math.floor(this.currentProgress);
  }

  /**
   * Send user back to analysis selection page
   */
  public newAnalysis(): void {
    this.onComplete.emit(true);
  }

  private analyseFiles(): void {}
}
