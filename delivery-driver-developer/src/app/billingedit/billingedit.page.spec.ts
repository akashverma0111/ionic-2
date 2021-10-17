import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingeditPage } from './billingedit.page';

describe('BillingeditPage', () => {
  let component: BillingeditPage;
  let fixture: ComponentFixture<BillingeditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingeditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingeditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
