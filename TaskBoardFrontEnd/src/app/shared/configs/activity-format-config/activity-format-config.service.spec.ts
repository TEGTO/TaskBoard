import { TestBed } from '@angular/core/testing';

import { ActivityFormatConfigService } from './activity-format-config.service';

describe('ActivityFormatConfigService', () => {
  let service: ActivityFormatConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityFormatConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
