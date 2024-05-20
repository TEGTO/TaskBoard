import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BoardTask, Priority, URLDefiner } from '../../../index';
import { TaskApiService } from './task-api.service';

describe('TaskApiService', () => {
  const mockTasks: BoardTask[] = [{ id: '1', boardTaskListId: "1", creationTime: new Date(), name: 'Task 1', priority: Priority.Low },
  { id: '2', boardTaskListId: "1", creationTime: new Date(), name: 'Task 2', priority: Priority.Low }];

  var httpTestingController: HttpTestingController;
  var service: TaskApiService;
  var mockUrlDefiner: jasmine.SpyObj<URLDefiner>

  beforeEach(() => {
    mockUrlDefiner = jasmine.createSpyObj<URLDefiner>('URLDefiner', ['combineWithApiUrl']);
    mockUrlDefiner.combineWithApiUrl.and.callFake((subpath: string) => subpath);

    TestBed.configureTestingModule({
      providers: [
        { provide: URLDefiner, useValue: mockUrlDefiner }
      ],
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
    const expectedReq1 = `/BoardTask/1`;
    const expectedReq2 = `/BoardTask/2`;


    service.getTaskById("1").subscribe(task => {
      expect(task).toEqual(mockTasks[0]);
    });
    service.getTaskById("2").subscribe(task => {
      expect(task).toEqual(mockTasks[1]);
    });

    const firstReq = httpTestingController.expectOne(expectedReq1);
    const secondReq = httpTestingController.expectOne(expectedReq2);
    expect(firstReq.request.method).toBe('GET');
    expect(secondReq.request.method).toBe('GET');
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq1);
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq2);
    firstReq.flush(mockTasks[0]);
    secondReq.flush(mockTasks[1]);
  });
  it('should send POST request', () => {
    const expectedReq = `/BoardTask`;

    service.createNewTask(mockTasks[0]).subscribe(task => {
      expect(task).toEqual(mockTasks[0]);
    });

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(mockTasks[0]);
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
  });
  it('should send PUT request', () => {
    const expectedReq = `/BoardTask?positionIndex=0`;

    service.updateTask(mockTasks[0], 0).subscribe();

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('PUT');
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
  });
  it('should send DELETE request', () => {
    const expectedReq = `/BoardTask/${mockTasks[0].id}`;

    service.deleteTask(mockTasks[0]).subscribe();

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('DELETE');
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
  });
});