import { TestBed } from '@angular/core/testing';

import { AllServicesService } from './all-services.service';

describe('AllServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AllServicesService = TestBed.get(AllServicesService);
    expect(service).toBeTruthy();
  });
});
