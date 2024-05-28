import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivityService } from '../../../action-history';
import { ActivityType, Board, BoardTask, BoardTaskList, Priority, TaskApiService } from '../../../shared';
import { ChangeTaskData } from '../../index';
import { TaskControllerService } from './task-controller.service';

describe('TaskControllerService', () => {
  const mockBoard: Board = { id: "1", userId: "1", creationTime: new Date() };
  var service: TaskControllerService;
  var mockTaskApiService: jasmine.SpyObj<TaskApiService>;
  var mockActivityService: jasmine.SpyObj<ActivityService>;

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
    const taskList = { id: 'list_id', boardId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] };
    const allTaskLists: BoardTaskList[] = [taskList];
    mockTaskApiService.createNewTask.and.returnValue(of(task));
    var data: ChangeTaskData = { task: task, currentTaskList: taskList, prevTaskList: taskList, allTaskLists: allTaskLists, board: mockBoard };
    service.createNewTask(data);

    expect(allTaskLists.length).toEqual(1);
    console.log(taskList);
    expect(allTaskLists[0].boardTasks[0]).toEqual(task);
    expect(mockTaskApiService.createNewTask).toHaveBeenCalledWith(task);
    expect(mockActivityService.createTaskActivity).toHaveBeenCalledWith(ActivityType.Create, jasmine.any(Object));
  });
  it('should call services to update task', () => {
    const task: BoardTask = { id: 'task_id', name: "Task", boardTaskListId: 'new_list_id', creationTime: new Date(), priority: Priority.Low };
    const prevTaskList: BoardTaskList = { id: 'list_id', boardId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [task] }
    const currentTaskList: BoardTaskList = { id: 'new_list_id', boardId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    const currentIndex = 0;
    mockTaskApiService.getTaskById.and.returnValue(of(task));
    mockTaskApiService.updateTask.and.returnValue(of(task));
    var data: ChangeTaskData = { task: task, currentTaskList: currentTaskList, prevTaskList: prevTaskList, allTaskLists: [], board: mockBoard };

    service.updateTask(data, currentIndex);

    expect(currentTaskList.boardTasks[0]).toEqual(task);
    expect(mockTaskApiService.getTaskById).toHaveBeenCalledWith(task.id);
    expect(mockTaskApiService.updateTask).toHaveBeenCalledWith(task, currentIndex);
    expect(mockActivityService.createTaskActivity).toHaveBeenCalledWith(ActivityType.Update, jasmine.any(Object));
  });
  it('should correct update task position', () => {
    var task: BoardTask = { id: 'task_id', name: "Task", boardTaskListId: 'new_list_id', creationTime: new Date(), priority: Priority.Low };
    var task2: BoardTask = { id: 'task_id_2', name: "Task", boardTaskListId: 'new_list_id', creationTime: new Date(), priority: Priority.Low };
    const firstTaskList: BoardTaskList = { id: 'list_id', boardId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [task] }
    const secondTaskList: BoardTaskList = { id: 'new_list_id', boardId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [task2, task2, task2] }
    mockTaskApiService.getTaskById.and.returnValue(of(task));
    mockTaskApiService.updateTask.and.returnValue(of(task));

    var data: ChangeTaskData = { task: task, currentTaskList: secondTaskList, prevTaskList: firstTaskList, allTaskLists: [], board: mockBoard };
    service.updateTask(data, 0);
    expect(firstTaskList.boardTasks[0]).not.toEqual(task);
    expect(secondTaskList.boardTasks[0]).toEqual(task);
    var data: ChangeTaskData = { task: task, currentTaskList: secondTaskList, prevTaskList: secondTaskList, allTaskLists: [], board: mockBoard };
    service.updateTask(data, 1);
    expect(secondTaskList.boardTasks[0]).not.toEqual(task);
    expect(secondTaskList.boardTasks[1]).toEqual(task);
    task.boardTaskListId = "list_id";
    var data: ChangeTaskData = { task: task, currentTaskList: firstTaskList, prevTaskList: secondTaskList, allTaskLists: [], board: mockBoard };
    service.updateTask(data, 0);
    expect(secondTaskList.boardTasks[1]).not.toEqual(task);
    expect(firstTaskList.boardTasks[0]).toEqual(task);
  });
  it('should delete task', () => {
    var task: BoardTask = { id: 'task_id', name: "Task", boardTaskListId: 'new_list_id', creationTime: new Date(), priority: Priority.Low };
    const currentTaskList: BoardTaskList = { id: 'new_list_id', boardId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [task] }
    var data: ChangeTaskData = { task: task, currentTaskList: currentTaskList, prevTaskList: currentTaskList, allTaskLists: [], board: mockBoard };
    mockTaskApiService.deleteTask.and.returnValue(of(task));
    service.deleteTask(data);

    expect(currentTaskList.boardTasks.length).toEqual(0);
    expect(mockTaskApiService.deleteTask).toHaveBeenCalledWith(task.id);
    expect(mockActivityService.createTaskActivity).toHaveBeenCalledWith(ActivityType.Delete, jasmine.any(Object));
  });
});