import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { List } from "immutable";
import { APAnalysis } from "src/app/electron/models/analysis";
import { defaultAnalyses } from "src/app/electron/models/defaultAnalyses";
import { WizardService } from "src/app/electron/services/wizard/wizard.service";
import { SharedModule } from "../../shared/shared.module";
import { TypeComponent } from "./type.component";

describe("TypeComponent", () => {
  let component: TypeComponent;
  let fixture: ComponentFixture<TypeComponent>;
  let wizard: WizardService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TypeComponent],
      imports: [SharedModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeComponent);
    component = fixture.componentInstance;
    wizard = TestBed.get(WizardService);
  });

  it("should create", () => {
    spyOn(wizard, "getAnalysis").and.callFake(() => undefined);
    spyOn(wizard, "getAnalysisTypes").and.callFake(() =>
      List<APAnalysis>(defaultAnalyses).toArray()
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should have header", () => {
    spyOn(wizard, "getAnalysis").and.callFake(() => {
      return undefined;
    });
    spyOn(wizard, "getAnalysisTypes").and.callFake(() =>
      List<APAnalysis>(defaultAnalyses).toArray()
    );
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector("div.card-header");
    expect(header).toBeTruthy();
    expect(header.innerText).toContain("Analysis Types");
  });
});
