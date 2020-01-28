import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { List } from "immutable";
import { Subject } from "rxjs";
import { AnalysisProgress } from "src/app/electron/services/AP/ap.service";
import { WizardService } from "src/app/electron/services/wizard/wizard.service";
import { SharedModule } from "../../shared/shared.module";
import { OutputComponent } from "./output.component";

describe("OutputComponent", () => {
  let component: OutputComponent;
  let fixture: ComponentFixture<OutputComponent>;
  let wizard: WizardService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OutputComponent],
      imports: [SharedModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputComponent);
    component = fixture.componentInstance;
    wizard = TestBed.get(WizardService);
  });

  it("should create", () => {
    spyOn(wizard, "getAnalyses").and.callFake(() => List([]));
    spyOn(wizard, "analyseFiles").and.callFake(() => {
      const subject = new Subject<AnalysisProgress>();

      return subject;
    });
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should have header", () => {
    spyOn(wizard, "getAnalyses").and.callFake(() => List([]));
    spyOn(wizard, "analyseFiles").and.callFake(() => {
      const subject = new Subject<AnalysisProgress>();

      return subject;
    });
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector("div.card-header");
    expect(header).toBeTruthy();
    expect(header.innerText).toContain("Analysis Output");
  });
});
