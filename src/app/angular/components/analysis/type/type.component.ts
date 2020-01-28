import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { APAnalysis } from "../../../../electron/models/analysis";
import { WizardService } from "../../../../electron/services/wizard/wizard.service";

@Component({
  selector: "app-analysis-type",
  templateUrl: "./type.component.html",
  styleUrls: ["./type.component.scss"]
})
export class TypeComponent implements OnInit {
  public isValid: boolean;
  public analysisOptions: AnalysisOption[];
  private previousAnalysis: APAnalysis;
  private analysis: APAnalysis;

  constructor(
    private wizard: WizardService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.previousAnalysis = this.wizard.getAnalysis();

    if (this.previousAnalysis) {
      this.analysis = this.wizard.getAnalysis();
    }

    this.analysisOptions = this.wizard.getAnalysisTypes().map(analysisType => {
      return {
        analysis: analysisType,
        isSelected: this.previousAnalysis
          ? analysisType.label === this.previousAnalysis.label
          : false
      } as AnalysisOption;
    });

    this.isValid = !!this.analysis;
  }

  /**
   * Set the selected analysis type
   * @param id ID of analysis option
   */
  public changeSelection(id: number): void {
    this.analysis = this.analysisOptions[id].analysis;
    this.analysisOptions.map((analysisOption, index) => {
      analysisOption.isSelected = index === id;
    });

    this.isValid = !!this.analysis;
  }

  public nextButton(): void {
    this.wizard.createAnalysis(this.analysis);
    this.router.navigateByUrl("/analysis/audio");
  }

  public backButton(): void {
    this.location.back();
  }
}

interface AnalysisOption {
  analysis: APAnalysis;
  isSelected: boolean;
}
