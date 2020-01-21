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

// /**
//  * Convert options array back to options object
//  * @param options Options
//  */
// export function convertToOptions(options: Option[]): AnalysisOptions {
//   const output: AnalysisOptions = {};

//   options.map(option => {
//     if (option.value) {
//       output[option.id] = option.value;
//     }
//   });

//   return output;
// }

// /**
//  * Create an array of config settings. This allows the angular components to handle the output better.
//  * @param config Config
//  */
// export function getConfigArray(config: AnalysisConfig): Config[] {
//   const output: Config[] = [];
//   let index = 0;

//   for (const key in config) {
//     if (config.hasOwnProperty(key)) {
//       const hasChildren = typeof config[key] === "object";
//       let value: string | number | Config[];

//       if (hasChildren) {
//         value = getConfigArray(config[key] as AnalysisConfig);
//       } else {
//         if (
//           typeof config[key] === "string" ||
//           typeof config[key] === "number"
//         ) {
//           value = config[key] as any;
//         }
//       }

//       output.push({ key, index, value, hasChildren });
//       index++;
//     }
//   }

//   return output;
// }

// /**
//  * Convert config array back to config object
//  * @param config Config
//  */
// export function convertToConfig(config: Config[]): AnalysisConfig {
//   const output = {};

//   for (const option of config) {
//     if (option.value instanceof Array) {
//       output[option.key] = convertToConfig(option.value);
//     } else {
//       output[option.key] = option.key;
//     }
//   }

//   return output;
// }
