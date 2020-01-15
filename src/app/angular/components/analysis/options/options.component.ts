import { Component, OnInit, Input } from "@angular/core";
import {
  AnalysisType,
  AnalysisOption,
  AnalysisAlignToMinute,
  AnalysisLogLevel,
  AnalysisMixDownToMono
} from "../../../../electron/models/analysis";
import { Option } from "./option/option.component";

@Component({
  selector: "app-analysis-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"]
})
export class OptionsComponent implements OnInit {
  @Input() analysis: AnalysisType;

  options: Option[];

  constructor() {}

  ngOnInit(): void {
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
  }
}
