import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {
  AdvancedComponent,
  getConfigArray,
  getOptionsArray
} from "./advanced.component";
import { AnalysisModule } from "../analysis.module";
import { SharedModule } from "../../shared/shared.module";
import { AnalysisProcessingType } from "../../../../electron/models/analysisHelper";
import { DEFAULT_OPTIONS } from "../../../../electron/models/defaultAnalyses";
import { APAnalysis } from "../../../../electron/models/analysis";

describe("AdvancedComponent", () => {
  let component: AdvancedComponent;
  let fixture: ComponentFixture<AdvancedComponent>;
  let analysis: APAnalysis;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [SharedModule, AnalysisModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    analysis = new APAnalysis(
      AnalysisProcessingType.audio2csv,
      "Basic Analysis",
      {
        template: "Towsey.Acoustic.yml",
        changes: {}
      },
      "Basic visual analysis of audio.",
      "[BETA] Generates all our default summary & spectral acoustic indices. Also generates false color spectrograms IFF IndexCalculationDuration==60.0.",
      { ...DEFAULT_OPTIONS }
    );
    analysis.audioFiles = ["audio_file.mp3"];
    analysis.output = "output_folder/";

    component.originalConfig = analysis.config;
    component.originalOptions = analysis.options;
    component.config = getConfigArray(analysis.config);
    component.options = getOptionsArray(analysis.options);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
