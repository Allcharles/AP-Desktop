import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfigComponent } from "./config.component";
import { SharedModule } from "../../../shared/shared.module";

describe("ConfigComponent", () => {
  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigComponent],
      imports: [SharedModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.config = [];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
