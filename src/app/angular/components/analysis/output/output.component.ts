import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from "@angular/core";
import { AnalysisItem } from "../../../../electron/models/analysis";
import { APService } from "../../../../electron/services/AP/ap.service";

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

  constructor(private ap: APService, private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.totalFiles = this.analyses.length;
    this.completeFiles = 0;
    this.currentProgress = 0;
    this.running = true;

    this.ap.analyseFiles(this.analyses).subscribe(
      update => {
        if (update.error) {
          console.error("Analysis Error: ", update.errorDetails);
        } else {
          this.currentAnalysis = update.analysis;
          this.currentProgress = update.progress;
          this.completeFiles = update.fileNumber;
          this.ref.detectChanges();
        }
      },
      err => {
        console.error("Analysis Error: ", err);
        this.running = false;
        this.ref.detectChanges();
      },
      () => {
        this.running = false;
        this.ref.detectChanges();
      }
    );
  }

  /**
   * Round the current progress value for display in the progress bar
   * @returns Floored value of currentProgress
   */
  public displayCurrentProgress(): number {
    return Math.floor(this.currentProgress);
  }

  /**
   * Send user back to analysis selection page
   */
  public newAnalysis(): void {
    this.onComplete.emit(true);
  }
}
