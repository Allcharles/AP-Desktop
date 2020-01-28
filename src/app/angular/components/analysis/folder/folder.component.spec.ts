import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "../../shared/shared.module";
import { FolderComponent } from "./folder.component";
import { RouterTestingModule } from "@angular/router/testing";
import { WizardService } from "src/app/electron/services/wizard/wizard.service";
import { APAnalysis } from "src/app/electron/models/analysis";
import { AnalysisProcessingType } from "src/app/electron/models/analysisHelper";

describe("FolderComponent", () => {
  let component: FolderComponent;
  let fixture: ComponentFixture<FolderComponent>;
  let wizard: WizardService;
  let analysis: APAnalysis;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FolderComponent],
      imports: [SharedModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderComponent);
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
    spyOn(wizard, "getAnalysis").and.callFake(() => analysis);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should have header", () => {
    spyOn(wizard, "getAnalysis").and.callFake(() => analysis);
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector("div.header");
    expect(header).toBeTruthy();
    expect(header.innerText).toContain("Select Output Folder");
  });
});
