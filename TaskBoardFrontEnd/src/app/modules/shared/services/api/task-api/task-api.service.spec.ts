import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BoardTask, Priority } from '../../../index';
import { TaskApiService } from './task-api.service';

describe('TaskApiService', () => {
  const mockTasks: BoardTask[] = [{ id: '1', boardTaskListId: "1", creationTime: new Date(), name: 'Task 1', priority: Priority.Low },
  { id: '2', boardTaskListId: "1", creationTime: new Date(), name: 'Task 2', priority: Priority.Low }];

  var httpTestingController: HttpTestingController;
  var service: TaskApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TaskApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get task by id', () => {
    service.getTaskById("1").subscribe(task => {
      expect(task).toEqual(mockTasks[0]);
    });
    service.getTaskById("2").subscribe(task => {
      expect(task).toEqual(mockTasks[1]);
    });

    const firstReq = httpTestingController.expectOne(`/api/BoardTask/1`);
    const secondReq = httpTestingController.expectOne(`/api/BoardTask/2`);
    expect(firstReq.request.method).toBe('GET');
    expect(secondReq.request.method).toBe('GET');
    firstReq.flush(mockTasks[0]);
    secondReq.flush(mockTasks[1]);
  });
  it('should send POST request', () => {
    service.createNewTask(mockTasks[0]).subscribe(task => {
      expect(task).toEqual(mockTasks[0]);
    });

    const req = httpTestingController.expectOne(`/api/BoardTask`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(mockTasks[0]);
  });
  it('should send PUT request', () => {
    service.updateTask(mockTasks[0], 0).subscribe();

    const req = httpTestingController.expectOne(`/api/BoardTask?positionIndex=0`);
    expect(req.request.method).toBe('PUT');
  });
  it('should send DELETE request', () => {
    service.deleteTask(mockTasks[0]).subscribe();

    const req = httpTestingController.expectOne(`/api/BoardTask/${mockTasks[0].id}`);
    expect(req.request.method).toBe('DELETE');
  });
});