import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberprofilePage } from './barberprofile.page';

describe('BarberprofilePage', () => {
  let component: BarberprofilePage;
  let fixture: ComponentFixture<BarberprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarberprofilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarberprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
