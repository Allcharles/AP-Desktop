import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-config-option",
  template: `
    <div *ngFor="let option of config" class="form-group row">
      <ng-container *ngIf="!option.hasChildren; else children">
        <label
          [for]="option.key"
          class="col-sm-6 col-md-4 col-lg-3 col-form-label"
        >
          {{ option.key }}
        </label>
        <div class="col-sm-6 col-md-8 col-lg-9">
          <input
            class="form-control"
            [id]="option.key"
            [type]="getType(option)"
            [value]="option.value.toString()"
          />
        </div>
      </ng-container>
      <ng-template #children>
        <label class="col-12">{{ option.key }}</label>

        <div class="pl-5 col-12">
          <app-config-option
            [config]="getChildConfig(option.value)"
          ></app-config-option>
        </div>
      </ng-template>
    </div>
  `
})
export class ConfigOptionComponent implements OnInit {
  @Input() config: Config[];

  constructor() {}

  ngOnInit(): void {}

  public getType(config: Config): string {
    if (typeof config.value === "number") {
      return "number";
    } else {
      return "test";
    }
  }

  public getChildConfig(value: string | number | Config[]): Config[] {
    if (value instanceof Array) {
      return value;
    } else {
      return null;
    }
  }
}

export interface Config {
  key: string;
  value: string | number | Config[];
  hasChildren: boolean;
}
