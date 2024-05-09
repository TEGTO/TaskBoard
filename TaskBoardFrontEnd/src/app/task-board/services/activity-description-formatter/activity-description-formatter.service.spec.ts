import { TestBed } from '@angular/core/testing';

import { ActivityDescriptionFormatterService } from './activity-description-formatter.service';

describe('ActivityDescriptionFormatterService', () => {
  let service: ActivityDescriptionFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityDescriptionFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
