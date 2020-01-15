import { Component, OnInit, Input } from "@angular/core";
import { AnalysisType } from "../../../../../electron/models/analysis";

@Component({
  selector: "app-option",
  templateUrl: "./option.component.html",
  styleUrls: ["./option.component.scss"]
})
export class OptionComponent implements OnInit {
  @Input() analysis: AnalysisType;
  @Input() option: Option;

  constructor() {}

  ngOnInit(): void {}

  public getValue(): string {
    const output = this.analysis.options[this.option.id];
    return output ? output : "";
  }

  public isSelected(id: string): boolean {
    const selected = this.analysis.options[this.option.id];
    return selected ? selected === id : false;
  }

  public isChecked(): boolean {
    const checked = this.analysis.options[this.option.id];
    return checked ? checked : false;
  }
}

export interface Option {
  id: string;
  label: string;
  type: "text" | "select" | "checkbox";
  options?: { id: string; label: string }[];
}
