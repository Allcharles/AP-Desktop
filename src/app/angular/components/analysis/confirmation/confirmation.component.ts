import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { List } from "immutable";
import { APAnalysis } from "../../../../electron/models/analysis";
import { WizardService } from "../../../../electron/services/wizard/wizard.service";

@Component({
  selector: "app-analysis-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.scss"]
})
export class ConfirmationComponent implements OnInit {
  public analyses: List<APAnalysis>;

  constructor(
    private wizard: WizardService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.wizard.saveAnalysis();
    this.analyses = this.wizard.getAnalyses();
  }

  public cancelButton(): void {
    this.wizard.destroyAnalyses();
    this.router.navigateByUrl("/analysis");
  }

  public backButton(): void {
    this.wizard.destroyAnalysis();
    this.location.back();
  }

  public nextButton(): void {
    this.router.navigateByUrl("/analysis");
  }

  public runButton(): void {
    this.router.navigateByUrl("/analysis/output");
  }
}
