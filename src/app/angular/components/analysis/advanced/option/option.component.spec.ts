import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OptionComponent } from "./option.component";
import { AnalysisOption } from "../../../../../electron/models/analysis";
import { SharedModule } from "../../../shared/shared.module";

describe("OptionComponent", () => {
  let component: OptionComponent;
  let fixture: ComponentFixture<OptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OptionComponent],
      imports: [SharedModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.option = {
      id: AnalysisOption.temporaryDirectory,
      label: "Temporary Directory",
      type: "text"
    };
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
