import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundCheckQuesPage } from './background-check-ques.page';

describe('BackgroundCheckQuesPage', () => {
  let component: BackgroundCheckQuesPage;
  let fixture: ComponentFixture<BackgroundCheckQuesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundCheckQuesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundCheckQuesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
