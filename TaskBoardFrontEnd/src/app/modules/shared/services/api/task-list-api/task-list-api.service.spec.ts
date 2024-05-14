import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BoardTaskList, User, UserApiService } from '../../../index';
import { TaskListApiService } from './task-list-api.service';

describe('TaskListApiService', () => {
  const userMockData: User = { id: "1" };
  var mockUserApiService: jasmine.SpyObj<UserApiService>;
  var httpTestingController: HttpTestingController;
  var service: TaskListApiService;

  beforeEach(() => {
    mockUserApiService = jasmine.createSpyObj<UserApiService>('UserApiService', ['getUser']);
    mockUserApiService.getUser.and.returnValue(of(userMockData));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UserApiService, useValue: mockUserApiService }
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

    service.getTaskLists().subscribe(taskLists => {
      expect(taskLists).toEqual(mockTaskLists);
    });

    expect(mockUserApiService.getUser).toHaveBeenCalledTimes(1);
    const req = httpTestingController.expectOne(`/api/BoardTaskLists/user/${userMockData.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTaskLists);
  });
  it('should send GET to get task lists by id', () => {
    const mockTaskLists: BoardTaskList[] = [{ id: '1', userId: userMockData.id, creationTime: new Date(), name: 'List 1', boardTasks: [] },
    { id: '2', userId: userMockData.id, creationTime: new Date(), name: 'List 2', boardTasks: [] }];
    const listId = '1';

    service.getTaskListById(listId).subscribe(taskList => {
      expect(taskList).toEqual(mockTaskLists[0]);
    });

    const req = httpTestingController.expectOne(`/api/BoardTaskLists/${listId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTaskLists.filter(x => x.id == listId)[0]);
  });
  it('should send POST to create new task list when user is available', () => {
    const mockTaskList: BoardTaskList = { id: '1', userId: userMockData.id, creationTime: new Date(), name: 'New List', boardTasks: [] };

    service.createNewTaskList(mockTaskList).subscribe(result => {
      expect(result).toEqual(mockTaskList);
    });

    expect(mockUserApiService.getUser).toHaveBeenCalledTimes(1);
    const req = httpTestingController.expectOne(`/api/BoardTaskLists`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockTaskList);
    req.flush(mockTaskList);
  });
  it('should not send POST to create new task list when user is not available', () => {
    const mockTaskList: BoardTaskList = { id: '1', userId: userMockData.id, creationTime: new Date(), name: 'New List', boardTasks: [] };

    mockUserApiService.getUser.and.returnValue(of(null));

    service.createNewTaskList(mockTaskList).subscribe(result => {
      expect(result).toBeUndefined();
    });

    httpTestingController.expectNone(`/api/BoardTaskLists`);
  });
  it('should send PUT request to update task list', () => {
    const taskList: BoardTaskList = { id: '1', userId: userMockData.id, creationTime: new Date(), name: 'List 1', boardTasks: [] };

    service.updateTaskList(taskList).subscribe();

    const req = httpTestingController.expectOne(`/api/BoardTaskLists`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(taskList);
    req.flush({});
  });
  it('should send DELETE request to delete task list', () => {
    const taskList: BoardTaskList = { id: '1', userId: userMockData.id, creationTime: new Date(), name: 'List 1', boardTasks: [] };

    service.deleteTaskList(taskList).subscribe();

    const req = httpTestingController.expectOne(`/api/BoardTaskLists/${taskList.id}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });
});
