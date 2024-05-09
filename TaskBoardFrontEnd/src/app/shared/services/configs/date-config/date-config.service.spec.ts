import { TestBed } from '@angular/core/testing';

import { DateConfigService } from './date-config.service';

describe('DateConfigService', () => {
  let service: DateConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
