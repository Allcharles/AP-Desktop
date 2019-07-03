import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisOutputComponent } from './analysis-output.component';

describe('AnalysisOutputComponent', () => {
  let component: AnalysisOutputComponent;
  let fixture: ComponentFixture<AnalysisOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysisOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
