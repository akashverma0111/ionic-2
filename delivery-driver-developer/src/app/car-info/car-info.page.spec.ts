import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarInfoPage } from './car-info.page';

describe('CarInfoPage', () => {
  let component: CarInfoPage;
  let fixture: ComponentFixture<CarInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
