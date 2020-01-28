import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OptionsEditorComponent } from "./options-editor.component";
import { SharedModule } from "../../shared/shared.module";
import { RouterTestingModule } from "@angular/router/testing";
import { AnalysisModule } from "../analysis.module";
import { WizardService } from "src/app/electron/services/wizard/wizard.service";
import { APAnalysis } from "src/app/electron/models/analysis";
import { AnalysisProcessingType } from "src/app/electron/models/analysisHelper";
import { fromJS } from "immutable";

describe("OptionsEditorComponent", () => {
  let component: OptionsEditorComponent;
  let fixture: ComponentFixture<OptionsEditorComponent>;
  let wizard: WizardService;
  let analysis: APAnalysis;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OptionsEditorComponent],
      imports: [SharedModule, AnalysisModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsEditorComponent);
    component = fixture.componentInstance;
    wizard = TestBed.get(WizardService);

    analysis = new APAnalysis(
      AnalysisProcessingType.audio2csv,
      "Basic Analysis",
      {
        template: "Towsey.Acoustic.yml",
        changes: {}
      },
      "Short Description.",
      "Description",
      {}
    );
  });

  it("should create", () => {
    spyOn(wizard, "getOptions").and.callFake(() => fromJS(analysis.options));
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should have header", () => {
    spyOn(wizard, "getOptions").and.callFake(() => fromJS(analysis.options));
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector("div.header");
    expect(header).toBeTruthy();
    expect(header.innerText).toContain("Analysis Options");
  });
});
