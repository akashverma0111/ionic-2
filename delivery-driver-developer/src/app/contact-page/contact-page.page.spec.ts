import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPagePage } from './contact-page.page';

describe('ContactPagePage', () => {
  let component: ContactPagePage;
  let fixture: ComponentFixture<ContactPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
