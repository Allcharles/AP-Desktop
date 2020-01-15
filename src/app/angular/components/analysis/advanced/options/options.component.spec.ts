import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OptionsComponent } from "./options.component";
import { OptionComponent } from "./option/option.component";
import {
  AnalysisType,
  AnalysisProcessingType
} from "../../../../electron/models/analysis";
import { DEFAULT_OPTIONS } from "../../../../electron/models/analysisTypes";

describe("OptionsComponent", () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;
  let analysis: AnalysisType;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OptionsComponent, OptionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsComponent);
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
