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

    console.log(this.analyses);
  }

  public cancelButton() {
    this.wizard.destroyAnalyses();
    this.router.navigateByUrl("/analysis");
  }

  public backButton() {
    this.wizard.destroyAnalysis();
    this.location.back();
  }

  public nextButton() {
    this.router.navigateByUrl("/analysis");
  }

  public runButton() {
    this.router.navigateByUrl("/analysis/output");
  }
}
