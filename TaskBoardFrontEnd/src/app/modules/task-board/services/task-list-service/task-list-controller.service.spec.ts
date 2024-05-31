import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { BoardTaskList, TaskListApiService } from '../../../shared';
import { createTaskList, getTaskListsByBoardId, removeTaskList, updateTaskList } from '../../store/tasks/task-list/task-list.actions';
import { TaskListControllerService } from './task-list-controller.service';

describe('TaskListControllerService', () => {
  var service: TaskListControllerService;
  var mockStore: jasmine.SpyObj<Store>;
  var mockTaskListApi: jasmine.SpyObj<TaskListApiService>;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj<Store>('Store', ['dispatch', 'select']);
    mockTaskListApi = jasmine.createSpyObj<TaskListApiService>('TaskListApiService', ['getTaskListById']);
    mockStore.select.and.returnValue(of([]));
    TestBed.configureTestingModule({
      providers: [
        TaskListControllerService,
        { provide: Store, useValue: mockStore },
        { provide: TaskListApiService, useValue: mockTaskListApi }
      ]
    });
    service = TestBed.inject(TaskListControllerService);
  });

  it('should dispatch getTaskListsByBoardId action and select task lists', () => {
    const boardId = '123';
    service.getTaskListsByBoardId(boardId).subscribe();
    expect(mockStore.dispatch).toHaveBeenCalledWith(getTaskListsByBoardId({ boardId }));
    expect(mockStore.select).toHaveBeenCalled();
  });
  it('should call getTaskListById from taskListApi', () => {
    const listId = '123';
    service.getTaskListById(listId);
    expect(mockTaskListApi.getTaskListById).toHaveBeenCalledWith(listId);
  });
  it('should dispatch createTaskList action', () => {
    const taskList: BoardTaskList = { id: '1', boardId: '1', creationTime: new Date(), name: 'Test Task List', boardTasks: [] };
    service.createNewTaskList(taskList);
    expect(mockStore.dispatch).toHaveBeenCalledWith(createTaskList({ taskList }));
  });
  it('should dispatch updateTaskList action', () => {
    const taskList: BoardTaskList = { id: '1', boardId: '1', creationTime: new Date(), name: 'Updated Task List', boardTasks: [] };
    service.updateTaskList(taskList);
    expect(mockStore.dispatch).toHaveBeenCalledWith(updateTaskList({ taskList }));
  });
  it('should dispatch removeTaskList action', () => {
    const taskList: BoardTaskList = { id: '1', boardId: '1', creationTime: new Date(), name: 'Task List to Delete', boardTasks: [] };
    service.deleteTaskList(taskList);
    expect(mockStore.dispatch).toHaveBeenCalledWith(removeTaskList({ listId: taskList.id }));
  });
});
