import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninSignupPage } from './signin-signup.page';

describe('SigninSignupPage', () => {
  let component: SigninSignupPage;
  let fixture: ComponentFixture<SigninSignupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninSignupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninSignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
