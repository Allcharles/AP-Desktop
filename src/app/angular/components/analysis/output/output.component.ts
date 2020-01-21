import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AnalysisItem } from "../../../../electron/models/analysisItem";
import { APService } from "../../../../electron/services/AP/ap.service";
import { WizardService } from "../../../../electron/services/wizard/wizard.service";

@Component({
  selector: "app-analysis-output",
  templateUrl: "./output.component.html",
  styleUrls: ["./output.component.scss"]
})
export class OutputComponent implements OnInit {
  public analyses: AnalysisItem[];
  public totalFiles: number;
  public completeFiles: number;
  public currentProgress: number;
  public currentAnalysis: AnalysisItem;
  public running: boolean;

  constructor(
    private ap: APService,
    private wizard: WizardService,
    private router: Router,
    private location: Location,
    private ref: ChangeDetectorRef
  ) {}

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

  public nextButton(): void {
    this.wizard.destroyAnalyses;
    this.router.navigateByUrl("/analysis");
  }

  public backButton(): void {
    this.location.back();
  }
}
