import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryHistory2Page } from './delivery-history2.page';

describe('DeliveryHistory2Page', () => {
  let component: DeliveryHistory2Page;
  let fixture: ComponentFixture<DeliveryHistory2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryHistory2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryHistory2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
