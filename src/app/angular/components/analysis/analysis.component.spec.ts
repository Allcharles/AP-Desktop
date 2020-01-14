import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "../shared/shared.module";
import { AnalysisComponent } from "./analysis.component";
import { AnalysisModule } from "./analysis.module";

describe("AnalysisComponent", () => {
  let component: AnalysisComponent;
  let fixture: ComponentFixture<AnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [SharedModule, AnalysisModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
