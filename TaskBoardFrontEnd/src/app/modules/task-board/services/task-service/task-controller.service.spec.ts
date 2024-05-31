import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ActivityService } from '../../../action-history';
import { BoardTask, BoardTaskList, Priority, TaskApiService } from '../../../shared';
import { createNewTask, deleteTask, updateTask } from '../../store/tasks/task/task.actions';
import { TaskControllerService } from './task-controller.service';

describe('TaskControllerService', () => {
  let service: TaskControllerService;
  let mockStore: jasmine.SpyObj<Store<any>>;
  let mockTaskApiService: jasmine.SpyObj<TaskApiService>;
  let mockActivityService: jasmine.SpyObj<ActivityService>;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);
    mockTaskApiService = jasmine.createSpyObj('TaskApiService', ['someMethod']);
    mockActivityService = jasmine.createSpyObj('ActivityService', ['someMethod']);

    TestBed.configureTestingModule({
      providers: [
        TaskControllerService,
        { provide: Store, useValue: mockStore },
        { provide: TaskApiService, useValue: mockTaskApiService },
        { provide: ActivityService, useValue: mockActivityService }
      ]
    });

    service = TestBed.inject(TaskControllerService);
  });

  it('should dispatch createNewTask action', () => {
    const task: BoardTask = { id: '1', boardTaskListId: '1', creationTime: new Date(), name: 'Test Task', description: 'Description', priority: Priority.Low };
    service.createNewTask(task);
    expect(mockStore.dispatch).toHaveBeenCalledWith(createNewTask({ task }));
  });
  it('should dispatch updateTask action', () => {
    const prevTaskList: BoardTaskList = { id: '1', boardId: '1', creationTime: new Date(), boardTasks: [{ id: '1', boardTaskListId: '1', creationTime: new Date(), name: 'Old Name', description: 'Old Description', priority: Priority.Low }] };
    const task: BoardTask = { id: '1', boardTaskListId: '1', creationTime: new Date(), name: 'Updated Name', description: 'Updated Description', priority: Priority.Low };
    const currentIndex: number = 1;
    service.updateTask(prevTaskList, task, currentIndex);
    expect(mockStore.dispatch).toHaveBeenCalledWith(updateTask({ prevTaskList, task, posIndex: currentIndex }));
  });
  it('should dispatch deleteTask action', () => {
    const task: BoardTask = { id: '1', boardTaskListId: '1', creationTime: new Date(), name: 'Task to Delete', description: 'Description', priority: Priority.Low };
    service.deleteTask(task);
    expect(mockStore.dispatch).toHaveBeenCalledWith(deleteTask({ taskId: task.id }));
  });
});