import { Injectable } from '@angular/core';
import { ActivityApiService, ActivityType, Board, BoardActivity, BoardTask, BoardTaskActivity, BoardTaskList, TaskActivityApiService } from '../../../shared';
import { ActivityDescriptionFormatterService, ActivityDescriptions, TaskActivityData, TaskListActivityData } from '../../index';
import { ActivityService } from './activity-service';

interface CreateActivityData {
  task: BoardTask | undefined,
  descriptions: ActivityDescriptions,
  board: Board
}

@Injectable({
  providedIn: 'root'
})
export class ActivityControllerService extends ActivityService {

  constructor(
    private activityApi: ActivityApiService,
    private takActivityApi: TaskActivityApiService,
    private descriptionFormatter: ActivityDescriptionFormatterService) {
    super();
  }

  getTaskActivitiesByTaskId(taskId: string) {
    return this.takActivityApi.getTaskActivitiesByTaskId(taskId);
  }
  getBoardActivitiesOnPageByBoardId(id: string, page: number, amountOnPage: number) {
    return this.activityApi.getBoardActivitiesOnPageByBoardId(id, page, amountOnPage);
  }
  getBoardActivityAmountByBoardId(id: string) {
    return this.activityApi.getBoardActivitiesAmountByBoardId(id);
  }
  async createTaskActivity(activityType: ActivityType, taskActivityData: TaskActivityData) {
    try {
      switch (activityType) {
        case ActivityType.Create:
          this.createTaskActivity_Create(taskActivityData.task, taskActivityData.board);
          break;
        case ActivityType.Update:
          if (!taskActivityData.prevTask)
            throw new Error('To create update activity, define previous task data!');
          await this.createTaskActivity_Update(taskActivityData.task, taskActivityData.prevTask, taskActivityData.board);
          break;
        case ActivityType.Delete:
          if (!taskActivityData.taskList)
            throw new Error('To create delete activity, define task list data!');
          this.createTaskActivity_Delete(taskActivityData.task, taskActivityData.taskList, taskActivityData.board);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }
  createTaskListActivity(activityType: ActivityType, listActivityData: TaskListActivityData) {
    try {
      switch (activityType) {
        case ActivityType.Create:
          this.createListActivity_Create(listActivityData.taskList, listActivityData.board);
          break;
        case ActivityType.Update:
          if (!listActivityData.prevTaskList)
            throw new Error('To create update activity, define previous task list data!');
          this.createListActivity_Update(listActivityData.taskList, listActivityData.prevTaskList, listActivityData.board);
          break;
        case ActivityType.Delete:
          this.createListActivity_Delete(listActivityData.taskList, listActivityData.board);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }
  private createTaskActivity_Create(task: BoardTask, board: Board) {
    var descriptions = this.descriptionFormatter.taskCreated(task)
    var data = this.getCreateActivityData(task, descriptions.activityDescription, descriptions.activityTaskDescription, board);
    this.createBoardActivity(data);
    this.createBoardTaskActivity(data);
  }
  private async createTaskActivity_Update(curentTask: BoardTask, prevTask: BoardTask, board: Board) {
    var descriptions = await this.descriptionFormatter.taskUpdated(curentTask, prevTask);
    for (var i = 0; i < descriptions.length; i++) {
      var data = this.getCreateActivityData(curentTask, descriptions[i].activityDescription, descriptions[i].activityTaskDescription, board);
      this.createBoardActivity(data);
      this.createBoardTaskActivity(data);
    }
  }
  private createTaskActivity_Delete(task: BoardTask, taskList: BoardTaskList, board: Board) {
    var descriptions = this.descriptionFormatter.taskDeleted(task, taskList)
    var data = this.getCreateActivityData(task, descriptions.activityDescription, descriptions.activityTaskDescription, board);
    this.createBoardActivity(data);
  }
  private createListActivity_Create(taskList: BoardTaskList, board: Board) {
    var description = this.descriptionFormatter.taskListCreated(taskList)
    var data = this.getCreateActivityData(undefined, description, "", board);
    this.createBoardActivity(data);
  }
  private createListActivity_Update(currentTaskList: BoardTaskList, prevTaskList: BoardTaskList, board: Board) {
    var descriptions = this.descriptionFormatter.taskListUpdate(currentTaskList, prevTaskList)
    for (var i = 0; i < descriptions.length; i++) {
      var data = this.getCreateActivityData(undefined, descriptions[i], "", board);
      this.createBoardActivity(data);
    }
  }
  private createListActivity_Delete(taskList: BoardTaskList, board: Board) {
    var description = this.descriptionFormatter.taskListDeleted(taskList)
    var data = this.getCreateActivityData(undefined, description, "", board);
    this.createBoardActivity(data);
  }
  private createBoardActivity(createActivityData: CreateActivityData): void {
    const boardActivity: BoardActivity = {
      id: "",
      boardId: createActivityData.board.id,
      activityTime: new Date(),
      description: createActivityData.descriptions.activityDescription
    };
    this.activityApi.createActivity(boardActivity).subscribe();
  }
  private createBoardTaskActivity(createActivityData: CreateActivityData) {
    const boardTaskActivity: BoardTaskActivity = {
      id: "",
      boardTaskId: createActivityData.task!.id,
      activityTime: new Date(),
      description: createActivityData.descriptions.activityTaskDescription
    };
    this.takActivityApi.createTaskActivity(boardTaskActivity).subscribe();
  }
  private getCreateActivityData(task: BoardTask | undefined, activityDescription: string, taskActivityDescription: string, board: Board) {
    var descriptions: ActivityDescriptions = { activityDescription: activityDescription, activityTaskDescription: taskActivityDescription };
    var data: CreateActivityData = { task: task, descriptions: descriptions, board: board };
    return data;
  }
}