import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutshopPage } from './aboutshop.page';

describe('AboutshopPage', () => {
  let component: AboutshopPage;
  let fixture: ComponentFixture<AboutshopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutshopPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutshopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
