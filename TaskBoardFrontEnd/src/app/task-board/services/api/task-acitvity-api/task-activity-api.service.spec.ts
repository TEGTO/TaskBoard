import { TestBed } from '@angular/core/testing';

import { TaskActivityApiService } from './task-activity-api.service';

describe('TaskActivityApiService', () => {
  let service: TaskActivityApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskActivityApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
