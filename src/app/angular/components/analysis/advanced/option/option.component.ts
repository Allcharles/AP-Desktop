import { Component, OnInit, Input, OnChanges } from "@angular/core";

@Component({
  selector: "app-option",
  templateUrl: "./option.component.html"
})
export class OptionComponent implements OnInit, OnChanges {
  @Input() option: Option;
  value: string;

  constructor() {}

  ngOnInit(): void {
    this.ngOnChanges();
  }

  ngOnChanges(): void {
    this.value = this.option.value as string;
  }

  public setValue(): void {
    if (!this.value || this.value === "") {
      delete this.option.value;
    } else {
      if (typeof this.option.value === "boolean") {
        this.option.value = !!this.value;
      } else if (typeof this.option.value === "number") {
        this.option.value = parseInt(this.value);
      } else {
        this.option.value = this.value;
      }
    }
  }

  public getValue(): string {
    const output = this.value;
    return output ? output : "";
  }

  public isSelected(id: string): boolean {
    const selected = this.value;
    return selected ? selected === id : false;
  }

  public isChecked(): boolean {
    return !!this.value ? true : false;
  }
}

export interface Option {
  id: string;
  label: string;
  value?: string | number | boolean;
  type: "text" | "select" | "checkbox";
  options?: { id: string; label: string }[];
}
