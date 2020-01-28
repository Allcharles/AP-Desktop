import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-analysis-advanced",
  templateUrl: "./advanced.component.html"
})
export class AdvancedComponent implements OnInit {
  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {}

  public nextButton(): void {
    this.router.navigateByUrl("/analysis/confirm");
  }

  public advancedButton(): void {
    this.router.navigateByUrl("/analysis/options");
  }

  public backButton(): void {
    this.location.back();
  }
}
