import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentInformationPage } from './document-information.page';

describe('DocumentInformationPage', () => {
  let component: DocumentInformationPage;
  let fixture: ComponentFixture<DocumentInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentInformationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
