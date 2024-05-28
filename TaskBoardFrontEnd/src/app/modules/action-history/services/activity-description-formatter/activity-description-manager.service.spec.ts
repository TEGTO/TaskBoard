import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { BoardTask, BoardTaskList, Priority, TaskListApiService } from '../../../shared';
import { ACTIVITY_FORMAT_CONFIG, ActivityFormatConfig } from '../../index';
import { ActivityDescriptionManagerService } from './activity-description-manager.service';

describe('ActivityDescriptionManagerService', () => {
  var service: ActivityDescriptionManagerService;
  var mockTaskListApiService: jasmine.SpyObj<TaskListApiService>;
  var formatConfig: ActivityFormatConfig =
  {
    mainNameStyleBegin: '',
    mainNameStyleEnd: '',
    secondaryNameStyleBegin: '',
    secondaryNameStyleEnd: '',
    maxNameLength: 20,
    maxNameLengthReplacingString: '...'
  };

  beforeEach(() => {
    mockTaskListApiService = jasmine.createSpyObj('TaskListApiService', ['getTaskListById']);

    TestBed.configureTestingModule({
      providers: [
        { provide: TaskListApiService, useValue: mockTaskListApiService },
        { provide: ACTIVITY_FORMAT_CONFIG, useValue: formatConfig }
      ]
    });

    service = TestBed.inject(ActivityDescriptionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return description for task activity type of "Create"', () => {
    const task: BoardTask = { id: '1', name: 'Task Name', boardTaskListId: 'list_id', creationTime: new Date(), priority: Priority.Low };
    const expectedDescription = {
      activityDescription: `You created ${formatMainName("Task Name")}`,
      activityTaskDescription: 'You created this task'
    };

    const description = service.taskCreated(task);

    expect(description).toEqual(expectedDescription);
  });
  it('should return description with max name length replacing srtring', () => {
    const task: BoardTask = { id: '1', name: 'Task Nameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', boardTaskListId: 'list_id', creationTime: new Date(), priority: Priority.Low };
    const expectedDescription = {
      activityDescription: `You created ${formatMainName("Task Nameeeeeeeeeeee...")}`,
      activityTaskDescription: 'You created this task'
    };

    const description = service.taskCreated(task);

    expect(description).toEqual(expectedDescription);
  });
  it('should return description for updated elements of board task', async () => {
    const prevTask: BoardTask = { id: '1', name: 'Task Prev', dueTime: new Date("1"), boardTaskListId: 'prev_list_id', creationTime: new Date(), priority: Priority.Low };
    const currentTask: BoardTask = { id: '1', name: 'Task Name', dueTime: new Date("2"), boardTaskListId: 'list_id', creationTime: new Date(), priority: Priority.High, description: "" };
    const prevList: BoardTaskList = { id: 'prev_list_id', name: 'List1', boardId: 'user_id', creationTime: new Date(), boardTasks: [] };
    const list: BoardTaskList = { id: 'list_id', name: 'List2', boardId: 'user_id', creationTime: new Date(), boardTasks: [] };
    mockTaskListApiService.getTaskListById.withArgs("list_id").and.returnValue(of(list));
    mockTaskListApiService.getTaskListById.withArgs("prev_list_id").and.returnValue(of(prevList));

    const updatedElements = await service.taskUpdated(currentTask, prevTask);

    expect(updatedElements.length).toBe(5);
    expect(updatedElements[0].activityDescription).toEqual(`You moved ${formatMainName("Task Name")} from ${formatSecondName("List1")} to ${formatSecondName("List2")}`);
    expect(updatedElements[1].activityDescription).toEqual(`You changed ${formatMainName("Task Name")} due time from 01.01.2001 to 01.02.2001`);
    expect(updatedElements[2].activityDescription).toEqual(`You changed name from ${formatMainName("Task Prev")} to ${formatMainName("Task Name")}`);
    expect(updatedElements[3].activityDescription).toEqual(`You changed ${formatMainName("Task Name")} description`);
    expect(updatedElements[4].activityDescription).toEqual(`You changed ${formatMainName("Task Name")} priority from Low to High`);
  });
  it('should return description for task activity type of "Delete"', () => {
    const task: BoardTask = { id: '1', name: 'Task Name', boardTaskListId: 'list_id', creationTime: new Date(), priority: Priority.Low };
    const list: BoardTaskList = { id: 'list_id', name: 'List2', boardId: 'user_id', creationTime: new Date(), boardTasks: [] };
    const expectedDescription = {
      activityDescription: `You removed ${formatMainName("Task Name")} from ${formatSecondName("List2")}`,
      activityTaskDescription: `You removed this task from ${formatSecondName("List2")}`
    };
    const description = service.taskDeleted(task, list);

    expect(description).toEqual(expectedDescription);
  });
  it('should return description for task list activity type of "Create"', () => {
    const list: BoardTaskList = { id: 'list_id', name: 'List2', boardId: 'user_id', creationTime: new Date(), boardTasks: [] };
    const description = service.taskListCreated(list);

    expect(description).toEqual(`You created ${formatSecondName("List2")}`);
  });
  it('should return description for task list activity type of "Update"', () => {
    const prevList: BoardTaskList = { id: 'list_id', name: 'List', boardId: 'user_id', creationTime: new Date(), boardTasks: [] };
    const list: BoardTaskList = { id: 'list_id', name: 'List2', boardId: 'user_id', creationTime: new Date(), boardTasks: [] };
    const description = service.taskListUpdate(list, prevList);

    expect(description).toEqual([`You changed name from ${formatSecondName("List")} to ${formatSecondName("List2")}`]);
  });
  it('should return description for task list activity type of "Delete"', () => {
    const list: BoardTaskList = { id: 'list_id', name: 'List2', boardId: 'user_id', creationTime: new Date(), boardTasks: [] };
    const description = service.taskListDeleted(list);

    expect(description).toEqual(`You removed ${formatSecondName("List2")}`);
  });
  function formatMainName(name: String) {
    return `${formatConfig.mainNameStyleBegin}${name}${formatConfig.mainNameStyleEnd}`
  }
  function formatSecondName(name: String) {
    return `${formatConfig.secondaryNameStyleBegin}${name}${formatConfig.secondaryNameStyleEnd}`
  }
});
