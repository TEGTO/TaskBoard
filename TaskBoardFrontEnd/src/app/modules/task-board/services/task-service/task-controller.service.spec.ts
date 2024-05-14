import { TestBed } from '@angular/core/testing';

import { TaskControllerService } from './task-controller.service';

describe('TaskControllerService', () => {
  let service: TaskControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
