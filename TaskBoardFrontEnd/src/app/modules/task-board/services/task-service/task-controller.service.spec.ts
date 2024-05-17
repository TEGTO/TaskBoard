import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivityService } from '../../../action-history';
import { ActivityType, BoardTask, BoardTaskList, Priority, TaskApiService } from '../../../shared';
import { TaskControllerService } from './task-controller.service';

describe('TaskControllerService', () => {
  let service: TaskControllerService;
  let mockTaskApiService: jasmine.SpyObj<TaskApiService>;
  let mockActivityService: jasmine.SpyObj<ActivityService>;

  beforeEach(() => {
    mockTaskApiService = jasmine.createSpyObj('TaskApiService', ['createNewTask', 'getTaskById', 'updateTask', 'deleteTask']);
    mockActivityService = jasmine.createSpyObj('ActivityService', ['createTaskActivity']);
    TestBed.configureTestingModule({
      providers: [
        TaskControllerService,
        { provide: TaskApiService, useValue: mockTaskApiService },
        { provide: ActivityService, useValue: mockActivityService }
      ]
    });

    service = TestBed.inject(TaskControllerService);
  });

  it('should call services to create new task', () => {
    const task: BoardTask = { id: 'task_id', boardTaskListId: 'list_id', creationTime: new Date(), priority: Priority.Low };
    const allTaskLists: BoardTaskList[] = [{ id: 'list_id', userId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] }];
    mockTaskApiService.createNewTask.and.returnValue(of(task));
    service.createNewTask(task, allTaskLists);

    expect(allTaskLists.length).toEqual(1);
    expect(allTaskLists[0].boardTasks[0]).toEqual(task);
    expect(mockTaskApiService.createNewTask).toHaveBeenCalledWith(task);
    expect(mockActivityService.createTaskActivity).toHaveBeenCalledWith(ActivityType.Create, { task, prevTask: undefined, taskList: undefined });
  });
  it('should call services to update task', () => {
    const task: BoardTask = { id: 'task_id', name: "Task", boardTaskListId: 'new_list_id', creationTime: new Date(), priority: Priority.Low };
    const prevTaskList: BoardTaskList = { id: 'list_id', userId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [task] }
    const currentTaskList: BoardTaskList = { id: 'new_list_id', userId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    const currentIndex = 0;
    mockTaskApiService.getTaskById.and.returnValue(of(task));
    mockTaskApiService.updateTask.and.returnValue(of(task));

    service.updateTask(task, prevTaskList, currentTaskList, currentIndex);

    expect(currentTaskList.boardTasks[0]).toEqual(task);
    expect(mockTaskApiService.getTaskById).toHaveBeenCalledWith(task.id);
    expect(mockTaskApiService.updateTask).toHaveBeenCalledWith(task, currentIndex);
    expect(mockActivityService.createTaskActivity).toHaveBeenCalledWith(ActivityType.Update, { task: task, prevTask: task, taskList: undefined });
  });
  it('should correct update task position', () => {
    var task: BoardTask = { id: 'task_id', name: "Task", boardTaskListId: 'new_list_id', creationTime: new Date(), priority: Priority.Low };
    var task2: BoardTask = { id: 'task_id_2', name: "Task", boardTaskListId: 'new_list_id', creationTime: new Date(), priority: Priority.Low };
    const firstTaskList: BoardTaskList = { id: 'list_id', userId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [task] }
    const secondTaskList: BoardTaskList = { id: 'new_list_id', userId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [task2, task2, task2] }
    mockTaskApiService.getTaskById.and.returnValue(of(task));
    mockTaskApiService.updateTask.and.returnValue(of(task));

    service.updateTask(task, firstTaskList, secondTaskList, 0);
    expect(firstTaskList.boardTasks[0]).not.toEqual(task);
    expect(secondTaskList.boardTasks[0]).toEqual(task);
    service.updateTask(task, secondTaskList, secondTaskList, 1);
    expect(secondTaskList.boardTasks[0]).not.toEqual(task);
    expect(secondTaskList.boardTasks[1]).toEqual(task);
    task.boardTaskListId = "list_id";
    service.updateTask(task, secondTaskList, firstTaskList, 0);
    expect(secondTaskList.boardTasks[1]).not.toEqual(task);
    expect(firstTaskList.boardTasks[0]).toEqual(task);
  });
  it('should delete task', () => {
    var task: BoardTask = { id: 'task_id', name: "Task", boardTaskListId: 'new_list_id', creationTime: new Date(), priority: Priority.Low };
    const currentTaskList: BoardTaskList = { id: 'new_list_id', userId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [task] }
    mockTaskApiService.deleteTask.and.returnValue(of(task));
    service.deleteTask(task, currentTaskList);

    expect(currentTaskList.boardTasks.length).toEqual(0);
    expect(mockTaskApiService.deleteTask).toHaveBeenCalledWith(task);
    expect(mockActivityService.createTaskActivity).toHaveBeenCalledWith(ActivityType.Delete, { task, prevTask: undefined, taskList: currentTaskList });
  });
});