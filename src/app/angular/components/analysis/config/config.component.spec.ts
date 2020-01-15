import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfigComponent } from "./config.component";
import { ConfigOptionComponent } from "./config-option/config-option.component";
import {
  AnalysisType,
  AnalysisProcessingType
} from "../../../../electron/models/analysis";
import { DEFAULT_OPTIONS } from "../../../../electron/models/analysisTypes";

describe("ConfigComponent", () => {
  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;
  let analysis: AnalysisType;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigComponent, ConfigOptionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigComponent);
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
