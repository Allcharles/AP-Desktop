import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OptionComponent } from "./option.component";
import {
  AnalysisOption,
  AnalysisType,
  AnalysisProcessingType
} from "../../../../../electron/models/analysis";
import { DEFAULT_OPTIONS } from "../../../../../electron/models/analysisTypes";

describe("OptionComponent", () => {
  let component: OptionComponent;
  let fixture: ComponentFixture<OptionComponent>;
  let analysis: AnalysisType;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OptionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionComponent);
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
    component.option = {
      id: AnalysisOption.temporaryDirectory,
      label: "Temporary Directory",
      type: "text"
    };
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
