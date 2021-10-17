import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStatusPage } from './view-status.page';

describe('ViewStatusPage', () => {
  let component: ViewStatusPage;
  let fixture: ComponentFixture<ViewStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStatusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
