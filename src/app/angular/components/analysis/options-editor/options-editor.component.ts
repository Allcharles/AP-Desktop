import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { APAnalysis } from "../../../../electron/models/analysis";
import {
  AnalysisAlignToMinute,
  AnalysisLogLevel,
  AnalysisOption,
  AnalysisOptions,
  Enabled
} from "../../../../electron/models/analysisHelper";
import { WizardService } from "../../../../electron/services/wizard/wizard.service";
import { Option } from "./option/option.component";

@Component({
  selector: "app-options-editor",
  templateUrl: "./options-editor.component.html",
  styleUrls: ["./options-editor.component.scss"]
})
export class OptionsEditorComponent implements OnInit {
  public optionsList: Option[];
  private analysis: APAnalysis;
  private options: AnalysisOptions;
  private changes = [
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

  constructor(
    private wizard: WizardService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.analysis = this.wizard.getAnalysis();
    this.reset();
  }

  public nextButton(): void {
    const newOptions: AnalysisOptions = {};

    this.optionsList.map(option => {
      if (option.value) {
        newOptions[option.id] = option.value;
      }
    });

    this.analysis.options = newOptions;
    this.router.navigateByUrl("/analysis/config");
  }

  public backButton(): void {
    this.location.back();
  }

  public reset(): void {
    this.options = this.analysis.options;

    // TODO Extract this to APAnalysis and defaultAnalyses
    this.optionsList = [
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
            id: Enabled.True,
            label: "Enabled"
          },
          {
            id: Enabled.False,
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

    this.changes.map(change => {
      if (this.options[change.key]) {
        this.optionsList[change.index].value = this.options[change.key];
      }
    });
  }
}
