import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankinginformationPage } from './bankinginformation.page';

describe('BankinginformationPage', () => {
  let component: BankinginformationPage;
  let fixture: ComponentFixture<BankinginformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankinginformationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankinginformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
