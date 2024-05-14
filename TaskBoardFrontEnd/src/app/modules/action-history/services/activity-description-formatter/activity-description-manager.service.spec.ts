import { TestBed } from '@angular/core/testing';

import { ActivityDescriptionManagerService } from './activity-description-manager.service';

describe('ActivityDescriptionManagerService', () => {
  let service: ActivityDescriptionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityDescriptionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
