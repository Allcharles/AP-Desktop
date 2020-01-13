import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-output",
  templateUrl: "./output.component.html",
  styleUrls: ["./output.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutputComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
