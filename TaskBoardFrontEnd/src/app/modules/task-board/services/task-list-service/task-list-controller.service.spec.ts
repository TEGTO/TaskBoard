import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivityService } from '../../../action-history';
import { ActivityType, Board, BoardTaskList, TaskListApiService } from '../../../shared';
import { ChangeTaskListData } from '../../index';
import { TaskListControllerService } from './task-list-controller.service';

describe('TaskListControllerService', () => {
  const mockBoard: Board = { id: "1", userId: "1", creationTime: new Date() };
  var service: TaskListControllerService;
  var taskListApiService: jasmine.SpyObj<TaskListApiService>;
  var activityService: jasmine.SpyObj<ActivityService>;

  beforeEach(() => {
    taskListApiService = jasmine.createSpyObj('TaskListApiService', ['getTaskListsByBoardId', 'getTaskListById', 'createNewTaskList', 'updateTaskList', 'deleteTaskList']);
    activityService = jasmine.createSpyObj('ActivityService', ['createTaskListActivity']);

    TestBed.configureTestingModule({
      providers: [
        TaskListControllerService,
        { provide: TaskListApiService, useValue: taskListApiService },
        { provide: ActivityService, useValue: activityService }
      ]
    });
    service = TestBed.inject(TaskListControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get lists by board id and call services', () => {
    const taskList: BoardTaskList = { id: 'list_id', boardId: "boardId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    const taskList1: BoardTaskList = { id: 'list_id1', boardId: "boardId", creationTime: new Date(), name: 'List 2', boardTasks: [] }
    const allTaskLists: BoardTaskList[] = [taskList, taskList1];
    taskListApiService.getTaskListsByBoardId.and.callFake((id: string) => {
      const filteredLists = allTaskLists.filter(x => x.boardId === id);
      return of(filteredLists);
    });

    service.getTaskListsByBoardId(taskList.boardId).subscribe(
      (result) => {
        expect(result.length).toBe(2);
        expect(result[0]).toBe(taskList);
        expect(taskListApiService.getTaskListsByBoardId).toHaveBeenCalledWith(taskList.boardId);
      }
    );
  });
  it('should get list by id and call services', () => {
    const taskList: BoardTaskList = { id: 'list_id', boardId: "boardId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    const allTaskLists: BoardTaskList[] = [taskList];
    taskListApiService.getTaskListById.and.callFake((id: string) => {
      const filteredList = allTaskLists.find(x => x.id === id);
      return of(filteredList);
    });

    service.getTaskListById(taskList.id).subscribe(
      (result) => {
        expect(result).toBe(taskList);
        expect(taskListApiService.getTaskListById).toHaveBeenCalledWith(taskList.id);
      }
    );
  });
  it('should create new task list and call services', () => {
    const taskList: BoardTaskList = { id: 'list_id', boardId: "boardId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    const allTaskLists: BoardTaskList[] = [];
    taskListApiService.createNewTaskList.and.returnValue(of(taskList));
    var data: ChangeTaskListData = { taskList: taskList, allTaskLists: allTaskLists, board: mockBoard };

    service.createNewTaskList(data);

    expect(allTaskLists.length).toBe(1);
    expect(allTaskLists[0]).toEqual(taskList);
    expect(taskListApiService.createNewTaskList).toHaveBeenCalledWith(taskList);
    expect(activityService.createTaskListActivity).toHaveBeenCalledWith(ActivityType.Create, jasmine.any(Object));
  });
  it('should update task list and call services', () => {
    const prevTaskList: BoardTaskList = { id: 'list_id', boardId: "boardId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    const taskList: BoardTaskList = { id: 'list_id', boardId: "boardId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    taskListApiService.getTaskListById.and.returnValue(of(prevTaskList));
    taskListApiService.updateTaskList.and.returnValue(of(taskList));
    var data: ChangeTaskListData = { taskList: taskList, allTaskLists: [], board: mockBoard };

    service.updateTaskList(data);

    expect(taskListApiService.getTaskListById).toHaveBeenCalledWith(taskList.id);
    expect(taskListApiService.updateTaskList).toHaveBeenCalledWith(taskList);
    expect(activityService.createTaskListActivity).toHaveBeenCalledWith(ActivityType.Update, jasmine.any(Object));
  });
  it('should delete task list and call services', () => {
    const taskList: BoardTaskList = { id: 'list_id', boardId: "boardId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    const allTaskLists = [taskList];
    taskListApiService.deleteTaskList.and.returnValue(of(taskList));
    var data: ChangeTaskListData = { taskList: taskList, allTaskLists: allTaskLists, board: mockBoard };

    service.deleteTaskList(data);

    expect(allTaskLists.length).toBe(0);
    expect(taskListApiService.deleteTaskList).toHaveBeenCalledWith(taskList.id);
    expect(activityService.createTaskListActivity).toHaveBeenCalledWith(ActivityType.Delete, jasmine.any(Object));
  });
});
