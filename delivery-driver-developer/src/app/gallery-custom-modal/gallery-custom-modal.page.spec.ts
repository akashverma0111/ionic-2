import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryCustomModalPage } from './gallery-custom-modal.page';

describe('GalleryCustomModalPage', () => {
  let component: GalleryCustomModalPage;
  let fixture: ComponentFixture<GalleryCustomModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryCustomModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryCustomModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
