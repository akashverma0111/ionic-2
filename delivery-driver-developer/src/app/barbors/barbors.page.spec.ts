import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarborsPage } from './barbors.page';

describe('BarborsPage', () => {
  let component: BarborsPage;
  let fixture: ComponentFixture<BarborsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarborsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarborsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
