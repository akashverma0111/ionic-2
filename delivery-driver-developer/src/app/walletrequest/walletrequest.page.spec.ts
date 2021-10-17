import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletrequestPage } from './walletrequest.page';

describe('WalletrequestPage', () => {
  let component: WalletrequestPage;
  let fixture: ComponentFixture<WalletrequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletrequestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletrequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
