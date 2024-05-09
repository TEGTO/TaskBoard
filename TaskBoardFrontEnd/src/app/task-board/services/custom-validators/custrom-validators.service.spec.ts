import { TestBed } from '@angular/core/testing';

import { CustromValidatorsService } from './custrom-validators.service';

describe('CustromValidatorsService', () => {
  let service: CustromValidatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustromValidatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
