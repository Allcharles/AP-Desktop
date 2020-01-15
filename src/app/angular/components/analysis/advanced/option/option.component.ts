import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from "@angular/core";
import { AnalysisType } from "../../../../../electron/models/analysis";

@Component({
  selector: "app-option",
  templateUrl: "./option.component.html"
})
export class OptionComponent implements OnInit, OnChanges {
  @Input() analysis: AnalysisType;
  @Input() option: Option;
  @Output() onChange = new EventEmitter<any>();

  public value: any;

  constructor() {}

  ngOnInit(): void {
    this.ngOnChanges();
  }

  ngOnChanges(): void {
    this.value = this.analysis.options[this.option.id];

    if (this.option.type === "select" && !this.value) {
      this.value = "unselected";
    }
  }

  public setValue(): void {
    if (
      !this.value ||
      this.value === "" ||
      (this.option.type === "select" && this.value === "unselected")
    ) {
      delete this.analysis.options[this.option.id];
    } else {
      this.analysis.options[this.option.id] = this.value;
    }
  }

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
