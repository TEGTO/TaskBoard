import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivityService } from '../../../action-history';
import { ActivityType, BoardTaskList, TaskListApiService } from '../../../shared';
import { TaskListControllerService } from './task-list-controller.service';

describe('TaskListControllerService', () => {
  let service: TaskListControllerService;
  let taskListApiService: jasmine.SpyObj<TaskListApiService>;
  let activityService: jasmine.SpyObj<ActivityService>;

  beforeEach(() => {
    const taskListApiSpy = jasmine.createSpyObj('TaskListApiService', ['getTaskLists', 'getTaskListById', 'createNewTaskList', 'updateTaskList', 'deleteTaskList']);
    const activityServiceSpy = jasmine.createSpyObj('ActivityService', ['createTaskListActivity']);

    TestBed.configureTestingModule({
      providers: [
        TaskListControllerService,
        { provide: TaskListApiService, useValue: taskListApiSpy },
        { provide: ActivityService, useValue: activityServiceSpy }
      ]
    });
    service = TestBed.inject(TaskListControllerService);
    taskListApiService = TestBed.inject(TaskListApiService) as jasmine.SpyObj<TaskListApiService>;
    activityService = TestBed.inject(ActivityService) as jasmine.SpyObj<ActivityService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create new task list and call services', () => {
    const taskList: BoardTaskList = { id: 'list_id', boardId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    const allTaskLists: BoardTaskList[] = [];
    taskListApiService.createNewTaskList.and.returnValue(of(taskList));

    service.createNewTaskList(taskList, allTaskLists);

    expect(allTaskLists.length).toBe(1);
    expect(allTaskLists[0]).toEqual(taskList);
    expect(taskListApiService.createNewTaskList).toHaveBeenCalledWith(taskList);
    expect(activityService.createTaskListActivity).toHaveBeenCalledWith(ActivityType.Create, {
      taskList: taskList,
      prevTaskList: undefined
    });
  });

  it('task list undefined create should do nothing', () => {
    const taskList: BoardTaskList | undefined = undefined;
    const allTaskLists: BoardTaskList[] = [];

    service.createNewTaskList(taskList, allTaskLists);

    expect(allTaskLists.length).toBe(0);
    expect(taskListApiService.createNewTaskList).not.toHaveBeenCalled();
    expect(activityService.createTaskListActivity).not.toHaveBeenCalled();
  });
  it('should update task list and call services', () => {
    const prevTaskList: BoardTaskList = { id: 'list_id', boardId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    const taskList: BoardTaskList = { id: 'list_id', boardId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    taskListApiService.getTaskListById.and.returnValue(of(prevTaskList));
    taskListApiService.updateTaskList.and.returnValue(of(taskList));

    service.updateTaskList(taskList);

    expect(taskListApiService.getTaskListById).toHaveBeenCalledWith(taskList.id);
    expect(taskListApiService.updateTaskList).toHaveBeenCalledWith(taskList);
    expect(activityService.createTaskListActivity).toHaveBeenCalledWith(ActivityType.Update, {
      taskList: taskList,
      prevTaskList: prevTaskList
    });
  });
  it('task list undefined create should do nothing', () => {
    const taskList: BoardTaskList | undefined = undefined;

    service.updateTaskList(taskList);

    expect(taskListApiService.updateTaskList).not.toHaveBeenCalled();
    expect(activityService.createTaskListActivity).not.toHaveBeenCalled();
  });
  it('should delete task list and call services', () => {
    const taskList: BoardTaskList = { id: 'list_id', boardId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    const allTaskLists = [taskList];
    taskListApiService.deleteTaskList.and.returnValue(of(taskList));

    service.deleteTaskList(taskList, allTaskLists);

    expect(allTaskLists.length).toBe(0);
    expect(taskListApiService.deleteTaskList).toHaveBeenCalledWith(taskList);
    expect(activityService.createTaskListActivity).toHaveBeenCalledWith(ActivityType.Delete, {
      taskList: taskList,
      prevTaskList: undefined
    });
  });
  it('task undefined delete should to nothing', () => {
    const taskList: BoardTaskList = { id: 'list_id', boardId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    const allTaskLists = [taskList];
    taskListApiService.deleteTaskList.and.returnValue(of(taskList));

    service.deleteTaskList(undefined, allTaskLists);

    expect(allTaskLists.length).toBe(1);
    expect(allTaskLists[0]).toEqual(taskList);
    expect(taskListApiService.deleteTaskList).not.toHaveBeenCalled();
    expect(activityService.createTaskListActivity).not.toHaveBeenCalled();
  });
});
