import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  AnalysisAlignToMinute,
  AnalysisLogLevel,
  AnalysisMixDownToMono,
  AnalysisOption
} from "../../../../electron/models/analysis";
import { AnalysisType } from "../../../../electron/models/analysisType";
import { Config } from "./config/config.component";
import { Option } from "./option/option.component";

@Component({
  selector: "app-analysis-advanced",
  templateUrl: "./advanced.component.html"
})
export class AdvancedComponent implements OnInit, OnDestroy {
  @Input() analysis: AnalysisType;

  public showAdvanced = false;
  public options: Option[];
  public config: Config[];
  private originalOptions: Option[];
  private originalConfig: Config[];

  constructor() {}

  ngOnInit(): void {
    this.config = this.convertToArray(this.analysis.getConfig());
    this.options = [
      {
        id: AnalysisOption.temporaryDirectory,
        label: "Temporary Directory",
        type: "text"
      },
      {
        id: AnalysisOption.audioOffset,
        label: "Audio Offset",
        type: "text"
      },
      {
        id: AnalysisOption.alignToMinute,
        label: "Align to Minute",
        type: "select",
        options: [
          {
            id: AnalysisAlignToMinute.noAlignment,
            label: "No alignment"
          },
          {
            id: AnalysisAlignToMinute.trimBoth,
            label: "Trim both ends of audio"
          },
          {
            id: AnalysisAlignToMinute.trimNeither,
            label: "Trim neither end of audio"
          },
          {
            id: AnalysisAlignToMinute.trimStart,
            label: "Trim beginning segment of audio"
          },
          {
            id: AnalysisAlignToMinute.trimEnd,
            label: "Trim ending segment of audio"
          }
        ]
      },
      {
        id: AnalysisOption.channels,
        label: "Audio Channels",
        type: "text"
      },
      {
        id: AnalysisOption.mixDownToMono,
        label: "Mix Down to Mono",
        type: "select",
        options: [
          {
            id: AnalysisMixDownToMono.True,
            label: "Enabled"
          },
          {
            id: AnalysisMixDownToMono.False,
            label: "Disabled"
          }
        ]
      },
      {
        id: AnalysisOption.parallel,
        label: "Parallel",
        type: "checkbox"
      },
      {
        id: AnalysisOption.copyLog,
        label: "Copy Log",
        type: "checkbox"
      },
      {
        id: AnalysisOption.copyConfig,
        label: "Copy Config",
        type: "checkbox"
      },
      {
        id: AnalysisOption.logLevel,
        label: "Log Level",
        type: "select",
        options: [
          {
            id: AnalysisLogLevel.info,
            label: "Info"
          },
          {
            id: AnalysisLogLevel.debug,
            label: "Debug"
          },
          {
            id: AnalysisLogLevel.trace,
            label: "Trace"
          },
          {
            id: AnalysisLogLevel.verbose,
            label: "Verbose"
          },
          {
            id: AnalysisLogLevel.all,
            label: "All"
          }
        ]
      }
    ];

    this.updateOption(0, AnalysisOption.temporaryDirectory);
    this.updateOption(1, AnalysisOption.audioOffset);
    this.updateOption(2, AnalysisOption.alignToMinute);
    this.updateOption(3, AnalysisOption.channels);
    this.updateOption(4, AnalysisOption.mixDownToMono);
    this.updateOption(5, AnalysisOption.parallel);
    this.updateOption(6, AnalysisOption.copyLog);
    this.updateOption(7, AnalysisOption.copyConfig);
    this.updateOption(8, AnalysisOption.logLevel);

    // Need to be very careful to create new objects
    this.originalConfig = this.config.map(configOption =>
      Object.assign({}, configOption)
    );
    this.originalOptions = this.options.map(option =>
      Object.assign({}, option)
    );

    // Update analysis
    this.analysis.setConfig(this.convertConfigToObject(this.config));
    this.analysis.options = this.convertOptionsToObject(this.options);
  }

  ngOnDestroy() {
    // Update analysis
    this.analysis.setConfig(this.convertConfigToObject(this.config));
    this.analysis.options = this.convertOptionsToObject(this.options);
  }

  private convertConfigToObject(config: Config[]): object {
    const output = {};

    for (const option of config) {
      if (option.value instanceof Array) {
        output[option.key] = this.convertConfigToObject(option.value);
      } else {
        output[option.key] = option.value;
      }
    }

    return output;
  }

  private convertOptionsToObject(options: Option[]): object {
    const output = {};

    for (const option of options) {
      if (option.value) {
        output[option.id] = option.value;
      }
    }

    return output;
  }

  private convertToArray(config: object): Config[] {
    const output: Config[] = [];
    let index = 0;

    for (const key in config) {
      if (config.hasOwnProperty(key)) {
        const hasChildren = typeof config[key] === "object";
        let value: string | number | Config[];

        if (hasChildren) {
          value = this.convertToArray(config[key]);
        } else {
          value = config[key];
        }

        output.push({ key, index, value, hasChildren });
        index++;
      }
    }

    return output;
  }

  private updateOption(index: number, key: string): void {
    if (this.analysis.options[key]) {
      this.options[index].value = this.analysis.options[key];
    }
  }

  /**
   * Reset options to previous state
   */
  public resetOptions(): void {
    // Need to be very careful to create new objects
    this.options = this.originalOptions.map(option =>
      Object.assign({}, option)
    );
  }

  /**
   * Reset config settings to previous state
   */
  public resetConfig(): void {
    // Need to be very careful to create new objects
    this.config = this.originalConfig.map(configOption =>
      Object.assign({}, configOption)
    );
  }
}
