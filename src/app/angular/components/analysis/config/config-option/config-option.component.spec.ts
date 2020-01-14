import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigOptionComponent } from './config-option.component';

describe('ConfigOptionComponent', () => {
  let component: ConfigOptionComponent;
  let fixture: ComponentFixture<ConfigOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
