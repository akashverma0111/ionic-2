import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardinfoPage } from './cardinfo.page';

describe('CardinfoPage', () => {
  let component: CardinfoPage;
  let fixture: ComponentFixture<CardinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardinfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
