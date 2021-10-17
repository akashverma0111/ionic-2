import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdduploadPage } from './addupload.page';

describe('AdduploadPage', () => {
  let component: AdduploadPage;
  let fixture: ComponentFixture<AdduploadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdduploadPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdduploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
