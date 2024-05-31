import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Board, BoardTaskList, CustomErrorHandler, URLDefiner } from '../../../index';
import { TaskListApiService } from './task-list-api.service';

describe('TaskListApiService', () => {
  const boardMockData: Board = { id: "1", userId: "1", creationTime: new Date() };
  var httpTestingController: HttpTestingController;
  var service: TaskListApiService;
  var mockUrlDefiner: jasmine.SpyObj<URLDefiner>;
  var mockErrorHandler: jasmine.SpyObj<CustomErrorHandler>;

  beforeEach(() => {
    mockUrlDefiner = jasmine.createSpyObj<URLDefiner>('URLDefiner', ['combineWithApiUrl']);
    mockUrlDefiner.combineWithApiUrl.and.callFake((subpath: string) => subpath);
    mockErrorHandler = jasmine.createSpyObj<CustomErrorHandler>('CustomErrorHandler', ['handleError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: URLDefiner, useValue: mockUrlDefiner },
        { provide: CustomErrorHandler, useValue: mockErrorHandler }
      ]
    });

    service = TestBed.inject(TaskListApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should send GET to get all task lists', () => {
    const mockTaskLists: BoardTaskList[] = [{ id: '1', boardId: boardMockData.id, creationTime: new Date(), name: 'List 1', boardTasks: [] },
    { id: '2', boardId: boardMockData.id, creationTime: new Date(), name: 'List 2', boardTasks: [] }];
    const expectedReq = `/BoardTaskList/board/${boardMockData.id}`;

    service.getTaskListsByBoardId(boardMockData.id).subscribe(taskLists => {
      expect(taskLists).toEqual(mockTaskLists);
    });

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    req.flush(mockTaskLists);
  });
  it('should send GET to get task lists by id', () => {
    const mockTaskLists: BoardTaskList[] = [{ id: '1', boardId: boardMockData.id, creationTime: new Date(), name: 'List 1', boardTasks: [] },
    { id: '2', boardId: boardMockData.id, creationTime: new Date(), name: 'List 2', boardTasks: [] }];
    const listId = '1';
    const expectedReq = `/BoardTaskList/${listId}`;

    service.getTaskListById(listId).subscribe(taskList => {
      expect(taskList).toEqual(mockTaskLists[0]);
    });

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    req.flush(mockTaskLists.filter(x => x.id == listId)[0]);
  });
  it('should send POST to create new task list', () => {
    const mockTaskList: BoardTaskList = { id: '1', boardId: boardMockData.id, creationTime: new Date(), name: 'New List', boardTasks: [] };
    const expectedReq = `/BoardTaskList`;

    service.createNewTaskList(mockTaskList).subscribe(result => {
      expect(result).toEqual(mockTaskList);
    });

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id).toEqual(mockTaskList.id);
    expect(req.request.body.boardId).toEqual(mockTaskList.boardId);
    expect(req.request.body.name).toEqual(mockTaskList.name);
    req.flush(mockTaskList);
  });
  it('should send PUT request to update task list', () => {
    const taskList: BoardTaskList = { id: '1', boardId: boardMockData.id, creationTime: new Date(), name: 'List 1', boardTasks: [] };
    const expectedReq = `/BoardTaskList`;

    service.updateTaskList(taskList).subscribe();

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(taskList);
    req.flush({});
  });
  it('should send DELETE request to delete task list', () => {
    const taskList: BoardTaskList = { id: '1', boardId: boardMockData.id, creationTime: new Date(), name: 'List 1', boardTasks: [] };
    const expectedReq = `/BoardTaskList/${taskList.id}`;

    service.deleteTaskList(taskList.id).subscribe();

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });
  it('should handle error for getTaskListsByBoardId', () => {
    const expectedReq = `/BoardTaskList/board/${boardMockData.id}`;
    const errorMessage = 'Http failure response for /BoardTaskList/board/1: 404 Not Found';

    service.getTaskListsByBoardId(boardMockData.id).subscribe(
      () => fail('expected an error, not task lists'),
      error => expect(error.message).toBe(errorMessage)
    );

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
  it('should handle error for getTaskListById', () => {
    const listId = '1';
    const expectedReq = `/BoardTaskList/${listId}`;
    const errorMessage = 'Http failure response for /BoardTaskList/1: 404 Not Found';

    service.getTaskListById(listId).subscribe(
      () => fail('expected an error, not a task list'),
      error => expect(error.message).toBe(errorMessage)
    );

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
  it('should handle error for createNewTaskList', () => {
    const mockTaskList: BoardTaskList = { id: '1', boardId: boardMockData.id, creationTime: new Date(), name: 'New List', boardTasks: [] };
    const expectedReq = `/BoardTaskList`;
    const errorMessage = 'Http failure response for /BoardTaskList: 500 Internal Server Error';

    service.createNewTaskList(mockTaskList).subscribe(
      () => fail('expected an error, not a task list'),
      error => expect(error.message).toBe(errorMessage)
    );

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('POST');
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });
  it('should handle error for updateTaskList', () => {
    const taskList: BoardTaskList = { id: '1', boardId: boardMockData.id, creationTime: new Date(), name: 'List 1', boardTasks: [] };
    const expectedReq = `/BoardTaskList`;
    const errorMessage = 'Http failure response for /BoardTaskList: 400 Bad Request';

    service.updateTaskList(taskList).subscribe(
      () => fail('expected an error, not an update success'),
      error => expect(error.message).toBe(errorMessage)
    );

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('PUT');
    req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
  });
  it('should handle error for deleteTaskList', () => {
    const taskList: BoardTaskList = { id: '1', boardId: boardMockData.id, creationTime: new Date(), name: 'List 1', boardTasks: [] };
    const expectedReq = `/BoardTaskList/${taskList.id}`;
    const errorMessage = 'Http failure response for /BoardTaskList/1: 404 Not Found';

    service.deleteTaskList(taskList.id).subscribe(
      () => fail('expected an error, not a delete success'),
      error => expect(error.message).toBe(errorMessage)
    );

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('DELETE');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
});
