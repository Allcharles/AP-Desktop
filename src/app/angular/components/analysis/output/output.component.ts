import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { APAnalysis } from "../../../../electron/models/analysis";
import { AnalysisItem } from "../../../../electron/models/analysisItem";
import { WizardService } from "../../../../electron/services/wizard/wizard.service";

@Component({
  selector: "app-analysis-output",
  templateUrl: "./output.component.html",
  styleUrls: ["./output.component.scss"]
})
export class OutputComponent implements OnInit {
  public totalFiles: number;
  public completeFiles: number;
  public currentProgress: number;
  public currentAnalysis: AnalysisItem;
  public progressBarType: "success" | "danger";
  public running: boolean;
  public pause: boolean;

  constructor(
    private wizard: WizardService,
    private router: Router,
    private location: Location,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.progressBarType = "success";
    this.runAnalysis();
  }

  public formatProgress(progress: number): number {
    return Math.floor(progress);
  }

  public nextButton(): void {
    this.wizard.destroyAnalyses();
    this.router.navigateByUrl("/analysis");
  }

  public backButton(): void {
    this.location.back();
  }

  public stopAnalysis(): void {
    this.wizard.cancelAnalysis();
  }

  public pauseAnalysis(): void {
    if (this.wizard.isPaused()) {
      this.wizard.unpauseAnalysis();
      this.runAnalysis();
      this.pause = false;
      this.running = true;
    } else {
      this.wizard.pauseAnalysis();
      this.running = false;
      this.pause = true;
    }
  }

  private runAnalysis(): void {
    const analyses: APAnalysis[] = this.wizard.getAnalyses();
    const items: AnalysisItem[] = [];
    analyses.forEach(analysis => {
      items.push(...analysis.generateBatch());
    });
    this.totalFiles = items.length;
    this.completeFiles = 0;
    this.currentProgress = 0;
    this.running = true;

    this.wizard.analyseFiles(items).subscribe(
      update => {
        if (update.error) {
          console.error("Analysis Error: ", update.errorDetails);
          this.progressBarType = "danger";
        } else {
          this.currentAnalysis = update.analysis;
          this.currentProgress = update.progress;
          this.completeFiles = update.fileNumber;
          this.ref.detectChanges();
        }
      },
      err => {
        console.error("Analysis Error: ", err);
        this.progressBarType = "danger";
        this.running = false;
        this.ref.detectChanges();
      },
      () => {
        this.running = false;
        this.ref.detectChanges();
      }
    );
  }
}
