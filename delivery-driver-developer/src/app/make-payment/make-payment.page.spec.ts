import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePaymentPage } from './make-payment.page';

describe('MakePaymentPage', () => {
  let component: MakePaymentPage;
  let fixture: ComponentFixture<MakePaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakePaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
