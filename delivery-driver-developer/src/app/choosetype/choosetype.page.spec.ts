import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosetypePage } from './choosetype.page';

describe('ChoosetypePage', () => {
  let component: ChoosetypePage;
  let fixture: ComponentFixture<ChoosetypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosetypePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosetypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
