import { Component, Input, OnInit } from "@angular/core";
import {
  AnalysisAlignToMinute,
  AnalysisLogLevel,
  AnalysisMixDownToMono,
  AnalysisOption,
  AnalysisOptions,
  AnalysisConfig
} from "../../../../electron/models/analysisHelper";
import { Config } from "./config/config.component";
import { Option } from "./option/option.component";

@Component({
  selector: "app-analysis-advanced",
  templateUrl: "./advanced.component.html"
})
export class AdvancedComponent implements OnInit {
  @Input() originalConfig: AnalysisConfig;
  @Input() originalOptions: AnalysisOptions;
  @Input() config: Config[];
  @Input() options: Option[];

  public showAdvanced = false;

  constructor() {}

  ngOnInit(): void {}

  /**
   * Reset options to previous state
   */
  public resetOptions(): void {
    this.options = getOptionsArray(this.originalOptions);
  }

  /**
   * Reset config settings to previous state
   */
  public resetConfig(): void {
    this.config = getConfigArray(this.originalConfig);
  }
}

/**
 * Create an array of options. This allows the angular components to handle the output better.
 * @param options Options
 */
export function getOptionsArray(options: AnalysisOptions): Option[] {
  const output: Option[] = [
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

  const changes = [
    { index: 0, key: AnalysisOption.temporaryDirectory },
    { index: 1, key: AnalysisOption.audioOffset },
    { index: 2, key: AnalysisOption.alignToMinute },
    { index: 3, key: AnalysisOption.channels },
    { index: 4, key: AnalysisOption.mixDownToMono },
    { index: 5, key: AnalysisOption.parallel },
    { index: 6, key: AnalysisOption.copyLog },
    { index: 7, key: AnalysisOption.copyConfig },
    { index: 8, key: AnalysisOption.logLevel }
  ];

  changes.map(change => {
    if (options[change.key]) {
      output[change.index].value = options[change.key];
    }
  });

  return output;
}

/**
 * Convert options array back to options object
 * @param options Options
 */
export function convertToOptions(options: Option[]): AnalysisOptions {
  const output: AnalysisOptions = {};

  options.map(option => {
    if (option.value) {
      output[option.id] = option.value;
    }
  });

  return output;
}

/**
 * Create an array of config settings. This allows the angular components to handle the output better.
 * @param config Config
 */
export function getConfigArray(config: AnalysisConfig): Config[] {
  const output: Config[] = [];
  let index = 0;

  for (const key in config) {
    if (config.hasOwnProperty(key)) {
      const hasChildren = typeof config[key] === "object";
      let value: string | number | Config[];

      if (hasChildren) {
        value = getConfigArray(config[key] as AnalysisConfig);
      } else {
        if (
          typeof config[key] === "string" ||
          typeof config[key] === "number"
        ) {
          value = config[key] as any;
        }
      }

      output.push({ key, index, value, hasChildren });
      index++;
    }
  }

  return output;
}

/**
 * Convert config array back to config object
 * @param config Config
 */
export function convertToConfig(config: Config[]): AnalysisConfig {
  const output = {};

  for (const option of config) {
    if (option.value instanceof Array) {
      output[option.key] = convertToConfig(option.value);
    } else {
      output[option.key] = option.key;
    }
  }

  return output;
}
