import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BoardTaskActivity } from '../../../index';
import { TaskActivityApiService } from './task-activity-api.service';

describe('TaskActivityApiService', () => {
  var httpTestingController: HttpTestingController;
  var service: TaskActivityApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TaskActivityApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should send GET to get task activities by task id', () => {
    const mockTaskActivities: BoardTaskActivity[] = [{ id: '1', boardTaskId: '1', activityTime: new Date() },
    { id: '2', boardTaskId: '2', activityTime: new Date() }];

    service.getTaskActivitiesByTaskId("1").subscribe(activities => {
      expect(activities[0]).toEqual(mockTaskActivities[0]);
    });
    service.getTaskActivitiesByTaskId("2").subscribe(activities => {
      expect(activities[0]).toEqual(mockTaskActivities[1]);
    });

    const firstReq = httpTestingController.expectOne(`/api/BoardTaskActivity/taskActivities/1`);
    const secondReq = httpTestingController.expectOne(`/api/BoardTaskActivity/taskActivities/2`);
    expect(firstReq.request.method).toBe('GET');
    expect(secondReq.request.method).toBe('GET');
    firstReq.flush(mockTaskActivities.filter(x => x.boardTaskId == "1"));
    secondReq.flush(mockTaskActivities.filter(x => x.boardTaskId == "2"));
  });
  it('should send POST to create task activity', () => {
    const mockTaskActivity: BoardTaskActivity = { id: '1', boardTaskId: '1', activityTime: new Date() };

    service.createTaskActivity(mockTaskActivity).subscribe(activity => {
      expect(activity).toEqual(mockTaskActivity);
    });

    const req = httpTestingController.expectOne(`/api/BoardTaskActivity`);
    expect(req.request.body).toEqual(mockTaskActivity);
    expect(req.request.method).toBe('POST');
    req.flush(mockTaskActivity);
  });
});
