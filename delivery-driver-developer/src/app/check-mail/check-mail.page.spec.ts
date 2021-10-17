import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckMailPage } from './check-mail.page';

describe('CheckMailPage', () => {
  let component: CheckMailPage;
  let fixture: ComponentFixture<CheckMailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckMailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckMailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
