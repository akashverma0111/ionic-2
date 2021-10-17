import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqSinglePage } from './faq-single.page';

describe('FaqSinglePage', () => {
  let component: FaqSinglePage;
  let fixture: ComponentFixture<FaqSinglePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqSinglePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqSinglePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
