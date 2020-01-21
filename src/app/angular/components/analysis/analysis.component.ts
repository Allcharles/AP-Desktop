import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

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

  constructor(private router: Router, private location: Location) {}

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
  }

  public changeSelection(index: number): void {
    this.selected = index;
    this.isValid = true;
  }

  public goBack() {
    this.location.back();
  }

  public goNext() {
    this.router.navigate(["analysis", "type"]);
  }
}
