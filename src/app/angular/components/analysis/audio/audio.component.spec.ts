import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AudioComponent } from "./audio.component";
import { SharedModule } from "../../shared/shared.module";
import { RouterTestingModule } from "@angular/router/testing";
import { WizardService } from "src/app/electron/services/wizard/wizard.service";

describe("AudioComponent", () => {
  let component: AudioComponent;
  let fixture: ComponentFixture<AudioComponent>;
  let wizard: WizardService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AudioComponent],
      imports: [SharedModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioComponent);
    component = fixture.componentInstance;
    wizard = TestBed.get(WizardService);
  });

  it("should create", () => {
    spyOn(wizard, "getAudioFiles").and.callFake(() => []);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should have header", () => {
    spyOn(wizard, "getAudioFiles").and.callFake(() => []);
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector("div.header");
    expect(header).toBeTruthy();
    expect(header.innerText).toContain("Audio Files");
  });
});
