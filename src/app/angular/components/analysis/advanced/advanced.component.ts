import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  AnalysisType,
  AnalysisOption,
  AnalysisAlignToMinute,
  AnalysisMixDownToMono,
  AnalysisLogLevel,
  AnalysisOptions
} from "../../../../electron/models/analysis";
import { AnalysisEvent } from "../analysis.component";
import { Option } from "./option/option.component";
import { Config } from "./config-option/config-option.component";

@Component({
  selector: "app-analysis-advanced",
  templateUrl: "./advanced.component.html"
})
export class AdvancedComponent implements OnInit {
  @Input() analysis: AnalysisType;

  public options: Option[];
  public config: Config[];
  private originalOptions: object;
  private originalConfig: AnalysisOptions;

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

    // Need to be very careful to create new objects
    this.originalConfig = Object.assign({}, this.analysis.getConfig());
    this.originalOptions = Object.assign({}, this.analysis.options);
  }

  private convertToArray(config: object): Config[] {
    const output: Config[] = [];

    for (const key in config) {
      if (config.hasOwnProperty(key)) {
        const hasChildren = typeof config[key] === "object";
        let value: string | number | Config[];

        if (hasChildren) {
          value = this.convertToArray(config[key]);
        } else {
          value = config[key];
        }

        output.push({ key, value, hasChildren });
      }
    }

    return output;
  }

  /**
   * Reset options to previous state
   */
  public resetOptions(): void {
    // Need to be very careful to create new objects
    this.analysis.options = Object.assign({}, this.originalOptions);
    this.options = this.options.slice();
  }

  /**
   * Reset config settings to previous state
   */
  public resetConfig(): void {
    // Need to be very careful to create new objects
    this.analysis.setConfig(Object.assign({}, this.originalConfig));
    this.config = this.convertToArray(Object.assign({}, this.originalConfig));
  }
}
