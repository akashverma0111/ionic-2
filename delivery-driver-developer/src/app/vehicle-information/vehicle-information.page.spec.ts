import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleInformationPage } from './vehicle-information.page';

describe('VehicleInformationPage', () => {
  let component: VehicleInformationPage;
  let fixture: ComponentFixture<VehicleInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleInformationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
