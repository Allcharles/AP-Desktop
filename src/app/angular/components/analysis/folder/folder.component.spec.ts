import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "../../shared/shared.module";
import { FolderComponent } from "./folder.component";

describe("FolderComponent", () => {
  let component: FolderComponent;
  let fixture: ComponentFixture<FolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FolderComponent],
      imports: [SharedModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
