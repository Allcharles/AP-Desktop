import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { WizardService } from "../../../electron/services/wizard/wizard.service";

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrls: ["./analysis.component.scss"]
})
export class AnalysisComponent implements OnInit {
  public selected: number;
  public options: {
    label: string;
    description: string;
  }[];
  public isValid: boolean;
  public backEnabled: boolean;

  constructor(
    private wizard: WizardService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.options = [
      {
        label: "Audio files longer than 5 minutes.",
        description: "Is each audio file longer than 5 minutes in length?"
      },
      {
        label: "Audio files shorter than 5 minutes.",
        description:
          "[UNSUPPORTED] Is each audio file shorter than 5 minutes in length?"
      }
    ];

    this.isValid = false;
    this.backEnabled = this.wizard.getAnalyses().count() > 0;

    const terminal = this.wizard.childProcess.spawn(
      "C:/Users/Charles/ap/AnalysisPrograms.exe",
      [
        "audio2csv",
        "D:/Desktop/AP Test Audio/F_014S01_20100803_140000.wav",
        "C:/Users/Charles/ap/ConfigFiles/Towsey.Acoustic.yml",
        "D:/Documents/AP Desktop/Basic Analysis/F_014S01_20100803_140000",
        "--parallel"
      ]
    );

    terminal.stdout.on("data", data => console.log("Data: ", data.toString()));
    terminal.stderr.on("error", error =>
      console.error("Error: ", error.toString())
    );
    terminal.on("close", code => console.log("Code: ", code));
  }

  public changeSelection(index: number): void {
    this.selected = index;
    this.isValid = true;
  }

  public goBack(): void {
    this.location.back();
  }

  public goNext(): void {
    this.router.navigateByUrl("/analysis/type");
  }
}
