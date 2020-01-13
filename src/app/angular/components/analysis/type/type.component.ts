import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ElectronService } from "../../../../electron/services/electron/electron.service";

@Component({
  selector: "app-analysis-type",
  templateUrl: "./type.component.html",
  styleUrls: ["./type.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeComponent implements OnInit {
  constructor(private electron: ElectronService) {}

  ngOnInit(): void {
    console.log("Type Selector");
    console.log(this.electron.getAnalysisTypes());
  }
}
