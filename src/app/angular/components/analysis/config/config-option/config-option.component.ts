import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-config-option",
  templateUrl: "./config-option.component.html",
  styleUrls: ["./config-option.component.scss"]
})
export class ConfigOptionComponent implements OnInit {
  @Input() config: Config[];

  constructor() {}

  ngOnInit() {}

  public getType(config: Config): string {
    if (typeof config.value === "number") {
      return "number";
    } else {
      return "test";
    }
  }
}

export interface Config {
  key: string;
  value: string | number | Config[];
  hasChildren: boolean;
}
