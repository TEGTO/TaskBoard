import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Board, BoardTaskList, URLDefiner } from '../../../index';
import { TaskListApiService } from './task-list-api.service';

describe('TaskListApiService', () => {
  const boardMockData: Board = { id: "1", userId: "1", creationTime: new Date() };
  var httpTestingController: HttpTestingController;
  var service: TaskListApiService;
  var mockUrlDefiner: jasmine.SpyObj<URLDefiner>

  beforeEach(() => {
    mockUrlDefiner = jasmine.createSpyObj<URLDefiner>('URLDefiner', ['combineWithApiUrl']);
    mockUrlDefiner.combineWithApiUrl.and.callFake((subpath: string) => subpath);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: URLDefiner, useValue: mockUrlDefiner }
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
    expect(req.request.body).toEqual(mockTaskList);
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

    service.deleteTaskList(taskList).subscribe();

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });
});
