import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { ActivityApiService, ActivityType, Priority, TaskActivityApiService, User, UserApiService } from '../../../shared';
import { ActivityDescriptionFormatterService, TaskActivityData } from '../../index';
import { ActivityControllerService } from './activity-controller.service';

fdescribe('ActivityControllerService', () => {
  const userMockData: User = { id: "user_id" };
  var mockUserService: jasmine.SpyObj<UserApiService>;
  var mockActivityApi: jasmine.SpyObj<ActivityApiService>;
  var mockTaskActivityApi: jasmine.SpyObj<TaskActivityApiService>;
  var mockDescriptionFormatter: jasmine.SpyObj<ActivityDescriptionFormatterService>;
  var service: ActivityControllerService;

  beforeEach(() => {
    mockDescriptionFormatter = jasmine.createSpyObj<ActivityDescriptionFormatterService>('ActivityDescriptionFormatterService',
      ['taskCreated', 'taskUpdated', 'taskDeleted', 'taskListCreated', 'taskListUpdate', 'taskListDeleted']);
    mockUserService = jasmine.createSpyObj<UserApiService>('UserApiService', ['getUser']);
    mockTaskActivityApi = jasmine.createSpyObj<TaskActivityApiService>('TaskActivityApiService', ['getTaskActivitiesByTaskId', 'createTaskActivity']);
    mockActivityApi = jasmine.createSpyObj<ActivityApiService>('ActivityApiService', ['getBoardActivitiesOnPage', 'createActivity', 'getBoardActivitiesAmount']);
    mockUserService.getUser.and.returnValue(of(userMockData));
    TestBed.configureTestingModule({
      providers: [
        ActivityControllerService,
        { provide: TaskActivityApiService, useValue: mockTaskActivityApi },
        { provide: ActivityDescriptionFormatterService, useValue: mockDescriptionFormatter },
        { provide: UserApiService, useValue: mockUserService },
        { provide: ActivityApiService, useValue: mockActivityApi },
      ]
    });
    service = TestBed.inject(ActivityControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get userId property on initialization', () => {
    expect(service['userId']).toBe('user_id');
  });
  it('should call api getTaskActivitiesByTaskId', () => {
    mockTaskActivityApi.getTaskActivitiesByTaskId.and.returnValue(of([]));
    const taskId = 'task_id';

    service.getTaskActivitiesByTaskId(taskId).subscribe();

    expect(mockTaskActivityApi.getTaskActivitiesByTaskId).toHaveBeenCalledWith(taskId);
  });
  it('should call api getBoardActivitiesOnPage', () => {
    mockActivityApi.getBoardActivitiesOnPage.and.returnValue(of([]));
    const page = 1;
    const amountOnPage = 10;

    service.getBoardActivitiesOnPage(page, amountOnPage).subscribe();

    expect(mockActivityApi.getBoardActivitiesOnPage).toHaveBeenCalledWith(page, amountOnPage);
  });
  it('should call api getBoardActivitiesAmount', () => {
    mockActivityApi.getBoardActivitiesAmount.and.returnValue(of(0));

    service.getBoardActivityAmount().subscribe();

    expect(mockActivityApi.getBoardActivitiesAmount).toHaveBeenCalled();
  });
  fit('should create task activity for Create type', () => {
    const taskActivityData: TaskActivityData = {
      task: { id: 'task_id', boardTaskListId: 'list_id', creationTime: new Date(), priority: Priority.Low },
      prevTask: undefined,
      taskList: undefined
    };
    spyOn<any>(service, 'createTaskActivity_Create');
    spyOn<any>(service, 'createBoardActivity');
    spyOn<any>(service, 'createBoardTaskActivity');

    service.createTaskActivity(ActivityType.Create, taskActivityData);

    expect(service['createTaskActivity_Create']).toHaveBeenCalledWith(taskActivityData.task);

    //expect(mockDescriptionFormatter.taskCreated).toHaveBeenCalledWith(taskActivityData.task);
  });
  it('should create task activity for Update type', async () => {
    const taskActivityData: TaskActivityData = {
      task: { id: 'task_id', boardTaskListId: 'list_id', creationTime: new Date(), priority: Priority.Low },
      prevTask: { id: 'task_id', boardTaskListId: 'list_id', creationTime: new Date(), priority: Priority.Low },
      taskList: undefined
    };
    spyOn<any>(service, 'createTaskActivity_Update');
    await service.createTaskActivity(ActivityType.Update, taskActivityData);
    expect(service['createTaskActivity_Update']).toHaveBeenCalledWith(taskActivityData.task, taskActivityData.prevTask!);
  });
  it('should create task activity for Delete type', () => {
    const taskActivityData: TaskActivityData = {
      task: { id: 'task_id', boardTaskListId: 'list_id', creationTime: new Date(), priority: Priority.Low },
      prevTask: undefined,
      taskList: { id: 'list_id', userId: 'user_id', creationTime: new Date(), boardTasks: [] }
    };
    spyOn<any>(service, 'createTaskActivity_Delete');
    service.createTaskActivity(ActivityType.Delete, taskActivityData);
    expect(service['createTaskActivity_Delete']).toHaveBeenCalledWith(taskActivityData.task, taskActivityData.taskList!);
  });

  // it('should create task activity for Update type', async () => {
  //   spyOn(service, 'createBoardActivity');
  //   spyOn(service, 'createBoardTaskActivity');
  //   spyOn(service.descriptionFormatter, 'taskUpdated').and.returnValue(Promise.resolve(['description1', 'description2']));

  //   const currentTask: BoardTask = { id: 'task_id', name: 'Task' };
  //   const prevTask: BoardTask = { id: 'prev_task_id', name: 'Prev Task' };

  //   await service.createTaskActivity_Update(currentTask, prevTask);

  //   expect(service.createBoardActivity).toHaveBeenCalledTimes(2);
  //   expect(service.createBoardTaskActivity).toHaveBeenCalledTimes(2);
  // });

  // it('should create task activity for Delete type', () => {
  //   spyOn(service, 'createBoardActivity');

  //   const task: BoardTask = { id: 'task_id', name: 'Task' };
  //   const taskList: BoardTaskList = { id: 'task_list_id', name: 'Task List' };

  //   service.createTaskActivity_Delete(task, taskList);

  //   expect(service.createBoardActivity).toHaveBeenCalled();
  // });
});
