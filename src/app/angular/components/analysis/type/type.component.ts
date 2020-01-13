import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { APService } from "../../../../electron/services/AP/ap.service";

@Component({
  selector: "app-analysis-type",
  templateUrl: "./type.component.html",
  styleUrls: ["./type.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeComponent implements OnInit {
  constructor(private apService: APService) {}

  ngOnInit(): void {
    console.log("Type Selector");
    console.log(this.apService.getAnalysisTypes());
  }
}
