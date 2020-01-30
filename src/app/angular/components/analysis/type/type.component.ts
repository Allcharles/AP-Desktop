import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from "@swimlane/ngx-datatable";
import { APAnalysis } from "../../../../electron/models/analysis";
import { WizardService } from "../../../../electron/services/wizard/wizard.service";

@Component({
  selector: "app-analysis-type",
  templateUrl: "./type.component.html",
  styleUrls: ["./type.component.scss"]
})
export class TypeComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  public rows = [];
  public temp = [];
  public selected = [];
  public columns = [{ name: "Type" }, { name: "Description" }];
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;

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

    this.rows = this.wizard.getAnalysisTypes().map(analysisType => {
      const row = {
        type: analysisType.label,
        description: analysisType.description,
        value: analysisType
      };

      // Select Basic Analysis by default
      if (analysisType.label === "Basic Analysis") {
        this.analysis = analysisType;
        this.selected = [row];
      }

      return row;
    });
    this.temp = [...this.rows];
    this.isValid = !!this.analysis;
  }

  public onSelect({ selected }): void {
    this.analysis = selected[0].value;
    this.isValid = true;
  }

  public updateFilter($event): void {
    const val = $event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.type.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
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
