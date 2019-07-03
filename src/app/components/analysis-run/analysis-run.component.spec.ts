import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisRunComponent } from './analysis-run.component';

describe('AnalysisRunComponent', () => {
  let component: AnalysisRunComponent;
  let fixture: ComponentFixture<AnalysisRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysisRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
