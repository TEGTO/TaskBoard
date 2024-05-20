import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BoardTaskList, URLDefiner, User, UserApiService } from '../../../index';
import { TaskListApiService } from './task-list-api.service';

describe('TaskListApiService', () => {
  const userMockData: User = { id: "1" };
  var httpTestingController: HttpTestingController;
  var service: TaskListApiService;
  var mockUserApiService: jasmine.SpyObj<UserApiService>;
  var mockUrlDefiner: jasmine.SpyObj<URLDefiner>

  beforeEach(() => {
    mockUserApiService = jasmine.createSpyObj<UserApiService>('UserApiService', ['getUser']);
    mockUrlDefiner = jasmine.createSpyObj<URLDefiner>('URLDefiner', ['combineWithApiUrl']);
    mockUserApiService.getUser.and.returnValue(of(userMockData));
    mockUrlDefiner.combineWithApiUrl.and.callFake((subpath: string) => subpath);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UserApiService, useValue: mockUserApiService },
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
    const mockTaskLists: BoardTaskList[] = [{ id: '1', userId: userMockData.id, creationTime: new Date(), name: 'List 1', boardTasks: [] },
    { id: '2', userId: userMockData.id, creationTime: new Date(), name: 'List 2', boardTasks: [] }];
    const expectedReq = `/BoardTaskLists/user/${userMockData.id}`;

    service.getTaskLists().subscribe(taskLists => {
      expect(taskLists).toEqual(mockTaskLists);
    });

    expect(mockUserApiService.getUser).toHaveBeenCalledTimes(1);
    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush(mockTaskLists);
  });
  it('should send GET to get task lists by id', () => {
    const mockTaskLists: BoardTaskList[] = [{ id: '1', userId: userMockData.id, creationTime: new Date(), name: 'List 1', boardTasks: [] },
    { id: '2', userId: userMockData.id, creationTime: new Date(), name: 'List 2', boardTasks: [] }];
    const listId = '1';
    const expectedReq = `/BoardTaskLists/${listId}`;

    service.getTaskListById(listId).subscribe(taskList => {
      expect(taskList).toEqual(mockTaskLists[0]);
    });

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush(mockTaskLists.filter(x => x.id == listId)[0]);
  });
  it('should send POST to create new task list when user is available', () => {
    const mockTaskList: BoardTaskList = { id: '1', userId: userMockData.id, creationTime: new Date(), name: 'New List', boardTasks: [] };
    const expectedReq = `/BoardTaskLists`;

    service.createNewTaskList(mockTaskList).subscribe(result => {
      expect(result).toEqual(mockTaskList);
    });

    expect(mockUserApiService.getUser).toHaveBeenCalledTimes(1);
    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockTaskList);
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush(mockTaskList);
  });
  it('should not send POST to create new task list when user is not available', () => {
    const mockTaskList: BoardTaskList = { id: '1', userId: userMockData.id, creationTime: new Date(), name: 'New List', boardTasks: [] };

    mockUserApiService.getUser.and.returnValue(of(null));

    service.createNewTaskList(mockTaskList).subscribe(result => {
      expect(result).toBeUndefined();
    });

    httpTestingController.expectNone(`/BoardTaskLists`);
  });
  it('should send PUT request to update task list', () => {
    const taskList: BoardTaskList = { id: '1', userId: userMockData.id, creationTime: new Date(), name: 'List 1', boardTasks: [] };
    const expectedReq = `/BoardTaskLists`;

    service.updateTaskList(taskList).subscribe();

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(taskList);
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush({});
  });
  it('should send DELETE request to delete task list', () => {
    const taskList: BoardTaskList = { id: '1', userId: userMockData.id, creationTime: new Date(), name: 'List 1', boardTasks: [] };
    const expectedReq = `/BoardTaskLists/${taskList.id}`;

    service.deleteTaskList(taskList).subscribe();

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toEqual('DELETE');
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush({});
  });
});
