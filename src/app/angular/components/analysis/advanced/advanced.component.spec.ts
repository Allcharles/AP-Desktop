import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from "../../shared/shared.module";
import { AnalysisModule } from "../analysis.module";
import { AdvancedComponent } from "./advanced.component";

describe("AdvancedComponent", () => {
  let component: AdvancedComponent;
  let fixture: ComponentFixture<AdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [SharedModule, AnalysisModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should have header", () => {
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector("div.card-header");
    expect(header).toBeTruthy();
    expect(header.innerText).toContain("Advanced Options");
  });
});
