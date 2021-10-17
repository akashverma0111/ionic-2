import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDriverPage } from './report-driver.page';

describe('ReportDriverPage', () => {
  let component: ReportDriverPage;
  let fixture: ComponentFixture<ReportDriverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDriverPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDriverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
