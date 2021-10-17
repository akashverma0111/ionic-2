import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfoPage } from './basic-info.page';

describe('BasicInfoPage', () => {
  let component: BasicInfoPage;
  let fixture: ComponentFixture<BasicInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
