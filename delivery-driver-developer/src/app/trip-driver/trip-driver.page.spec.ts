import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDriverPage } from './trip-driver.page';

describe('TripDriverPage', () => {
  let component: TripDriverPage;
  let fixture: ComponentFixture<TripDriverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripDriverPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripDriverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
