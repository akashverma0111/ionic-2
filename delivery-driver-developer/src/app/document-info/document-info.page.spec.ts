import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentInfoPage } from './document-info.page';

describe('DocumentInfoPage', () => {
  let component: DocumentInfoPage;
  let fixture: ComponentFixture<DocumentInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
