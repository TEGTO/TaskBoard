import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { ActivityApiService, ActivityType, Board, Priority, TaskActivityApiService } from '../../../shared';
import { ActivityDescriptionFormatterService, TaskActivityData, TaskListActivityData } from '../../index';
import { ActivityControllerService } from './activity-controller.service';

describe('ActivityControllerService', () => {
  const mockBoardData: Board = { id: "1", userId: "1", creationTime: new Date() };
  var mockActivityApi: jasmine.SpyObj<ActivityApiService>;
  var mockTaskActivityApi: jasmine.SpyObj<TaskActivityApiService>;
  var mockDescriptionFormatter: jasmine.SpyObj<ActivityDescriptionFormatterService>;
  var service: ActivityControllerService;

  beforeEach(() => {
    mockDescriptionFormatter = jasmine.createSpyObj<ActivityDescriptionFormatterService>('ActivityDescriptionFormatterService',
      ['taskCreated', 'taskUpdated', 'taskDeleted', 'taskListCreated', 'taskListUpdate', 'taskListDeleted']);
    mockTaskActivityApi = jasmine.createSpyObj<TaskActivityApiService>('TaskActivityApiService', ['getTaskActivitiesByTaskId', 'createTaskActivity']);
    mockActivityApi = jasmine.createSpyObj<ActivityApiService>('ActivityApiService', ['getBoardActivitiesAmountByBoardId', 'getBoardActivitiesOnPageByBoardId', 'createActivity']);
    mockActivityApi.createActivity.and.returnValue(of({ id: "", boardId: "", activityTime: new Date(), description: "" }));
    mockDescriptionFormatter.taskCreated.and.returnValue({ activityDescription: "", activityTaskDescription: "" });
    TestBed.configureTestingModule({
      providers: [
        ActivityControllerService,
        { provide: TaskActivityApiService, useValue: mockTaskActivityApi },
        { provide: ActivityDescriptionFormatterService, useValue: mockDescriptionFormatter },
        { provide: ActivityApiService, useValue: mockActivityApi },
      ]
    });
    service = TestBed.inject(ActivityControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call api getTaskActivitiesByTaskId', () => {
    mockTaskActivityApi.getTaskActivitiesByTaskId.and.returnValue(of([]));
    const taskId = 'task_id';

    service.getTaskActivitiesByTaskId(taskId).subscribe();

    expect(mockTaskActivityApi.getTaskActivitiesByTaskId).toHaveBeenCalledWith(taskId);
  });
  it('should call api getBoardActivitiesOnPage', () => {
    mockActivityApi.getBoardActivitiesOnPageByBoardId.and.returnValue(of([]));
    const page = 1;
    const amountOnPage = 10;

    service.getBoardActivitiesOnPageByBoardId(mockBoardData.id, page, amountOnPage).subscribe();

    expect(mockActivityApi.getBoardActivitiesOnPageByBoardId).toHaveBeenCalledWith(mockBoardData.id, page, amountOnPage);
  });
  it('should call api getBoardActivitiesAmount', () => {
    mockActivityApi.getBoardActivitiesAmountByBoardId.and.returnValue(of(0));

    service.getBoardActivityAmountByBoardId(mockBoardData.id).subscribe();

    expect(mockActivityApi.getBoardActivitiesAmountByBoardId).toHaveBeenCalledWith(mockBoardData.id);
  });
  it('should create task activity type of "Create"', async () => {
    const taskActivityData: TaskActivityData = {
      task: { id: 'task_id', boardTaskListId: 'list_id', creationTime: new Date(), priority: Priority.Low },
      prevTask: undefined,
      taskList: undefined
    };
    spyOn<any>(service, 'createBoardActivity');
    spyOn<any>(service, 'createBoardTaskActivity');
    await service.createTaskActivity(ActivityType.Create, taskActivityData);

    expect(service['createBoardActivity']).toHaveBeenCalled();
    expect(service['createBoardTaskActivity']).toHaveBeenCalled();
    expect(mockDescriptionFormatter.taskCreated).toHaveBeenCalledWith(taskActivityData.task);
  });
  it('should create task activity type of "Update"', async () => {
    const taskActivityData: TaskActivityData = {
      task: { id: 'task_id', boardTaskListId: 'list_id', creationTime: new Date(), priority: Priority.Low },
      prevTask: { id: 'task_id', boardTaskListId: 'list_id', creationTime: new Date(), priority: Priority.Low },
      taskList: undefined
    };
    mockDescriptionFormatter.taskUpdated.and.returnValue(Promise.resolve(
      [{ activityDescription: 'description1', activityTaskDescription: 'description1' }]));
    spyOn<any>(service, 'createBoardActivity');
    spyOn<any>(service, 'createBoardTaskActivity');
    await service.createTaskActivity(ActivityType.Update, taskActivityData);

    expect(service['createBoardActivity']).toHaveBeenCalled();
    expect(service['createBoardTaskActivity']).toHaveBeenCalled();
    expect(mockDescriptionFormatter.taskUpdated).toHaveBeenCalledWith(taskActivityData.task, taskActivityData.prevTask!);
  });
  it('should create task activity type of "Delete"', () => {
    const taskActivityData: TaskActivityData = {
      task: { id: 'task_id', boardTaskListId: 'list_id', creationTime: new Date(), priority: Priority.Low },
      prevTask: undefined,
      taskList: { id: 'list_id', boardId: 'user_id', creationTime: new Date(), boardTasks: [] }
    };
    spyOn<any>(service, 'createBoardActivity');
    spyOn<any>(service, 'createBoardTaskActivity');
    service.createTaskActivity(ActivityType.Delete, taskActivityData);

    expect(service['createBoardActivity']).toHaveBeenCalled();
    expect(mockDescriptionFormatter.taskDeleted).toHaveBeenCalledWith(taskActivityData.task, taskActivityData.taskList!);
  });
  it('should create activity for list type of "Create"', async () => {
    const taskListActivityData: TaskListActivityData = {
      taskList: { id: 'task_id', boardId: 'user_id', creationTime: new Date(), boardTasks: [] },
      prevTaskList: undefined,
    };
    spyOn<any>(service, 'createBoardActivity');
    spyOn<any>(service, 'createBoardTaskActivity');
    await service.createTaskListActivity(ActivityType.Create, taskListActivityData);

    expect(service['createBoardActivity']).toHaveBeenCalled();
    expect(mockDescriptionFormatter.taskListCreated).toHaveBeenCalledWith(taskListActivityData.taskList);
  });
  it('should create activity for list type of "Update"', async () => {
    const taskListActivityData: TaskListActivityData = {
      taskList: { id: 'task_id', boardId: 'user_id', creationTime: new Date(), boardTasks: [] },
      prevTaskList: { id: 'prev_task_id', boardId: 'user_id', creationTime: new Date(), boardTasks: [] },
    };
    mockDescriptionFormatter.taskListUpdate.and.returnValue(['description1']);
    spyOn<any>(service, 'createBoardActivity');
    spyOn<any>(service, 'createBoardTaskActivity');
    await service.createTaskListActivity(ActivityType.Update, taskListActivityData);

    expect(service['createBoardActivity']).toHaveBeenCalled();
    expect(mockDescriptionFormatter.taskListUpdate).toHaveBeenCalledWith(taskListActivityData.taskList, taskListActivityData.prevTaskList!);
  });
  it('should create activity for list type of "Delete"', async () => {
    const taskListActivityData: TaskListActivityData = {
      taskList: { id: 'task_id', boardId: 'user_id', creationTime: new Date(), boardTasks: [] },
      prevTaskList: { id: 'prev_task_id', boardId: 'user_id', creationTime: new Date(), boardTasks: [] },
    };
    spyOn<any>(service, 'createBoardActivity');
    spyOn<any>(service, 'createBoardTaskActivity');
    await service.createTaskListActivity(ActivityType.Delete, taskListActivityData);

    expect(service['createBoardActivity']).toHaveBeenCalled();
    expect(mockDescriptionFormatter.taskListDeleted).toHaveBeenCalledWith(taskListActivityData.taskList);
  });
});
