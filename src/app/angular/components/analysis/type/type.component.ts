import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
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

  public rows: { type: string; description: string; value: APAnalysis }[] = [];
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
    private location: Location,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.previousAnalysis = this.wizard.getAnalysis();

    if (this.previousAnalysis) {
      this.analysis = this.wizard.getAnalysis();
    }

    this.wizard.getAnalysisTypes().subscribe(analysisTypes => {
      this.rows = analysisTypes.map(analysisType => {
        const row = {
          type: analysisType.label,
          description: analysisType.description,
          value: analysisType
        };

        // Select Basic Analysis by default
        if (
          (this.analysis && analysisType.label === this.analysis.label) ||
          (!this.analysis && analysisType.label === "Basic Analysis")
        ) {
          this.analysis = analysisType;
          this.selected = [row];
        }

        return row;
      });
      this.temp = [...this.rows];
      this.isValid = !!this.analysis;
      this.ref.detectChanges();
    });
  }

  public onSelect({ selected }): void {
    console.log("Selected");

    this.analysis = selected[0].value;
    this.isValid = true;
    this.ref.detectChanges();
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
