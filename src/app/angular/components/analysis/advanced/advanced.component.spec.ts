import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdvancedComponent } from "./advanced.component";
import {
  AnalysisType,
  AnalysisProcessingType
} from "src/app/electron/models/analysis";
import { DEFAULT_OPTIONS } from "src/app/electron/models/analysisTypes";
import { AnalysisModule } from "../analysis.module";
import { SharedModule } from "../../shared/shared.module";

describe("AdvancedComponent", () => {
  let component: AdvancedComponent;
  let fixture: ComponentFixture<AdvancedComponent>;
  let analysis: AnalysisType;

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
    analysis = new AnalysisType(
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

    component.analysis = analysis;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
