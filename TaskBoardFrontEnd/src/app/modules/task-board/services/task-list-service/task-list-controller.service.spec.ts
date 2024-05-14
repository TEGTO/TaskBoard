import { TestBed } from '@angular/core/testing';

import { TaskListControllerService } from './task-list-controller.service';

describe('TaskListControllerService', () => {
  let service: TaskListControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskListControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
