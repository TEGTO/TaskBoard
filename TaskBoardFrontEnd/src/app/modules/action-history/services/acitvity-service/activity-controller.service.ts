import { Injectable } from '@angular/core';
import { ActivityApiService, ActivityType, BoardActivity, BoardTask, BoardTaskActivity, BoardTaskList, TaskActivityApiService, UserApiService } from '../../../shared';
import { ActivityDescriptionFormatterService, ActivityDescriptions, TaskActivityData, TaskListActivityData } from '../../index';
import { ActivityService } from './activity-service';

@Injectable({
  providedIn: 'root'
})
export class ActivityControllerService extends ActivityService {
  private userId: string = "";

  constructor(
    private userService: UserApiService,
    private activityApi: ActivityApiService,
    private takActivityApi: TaskActivityApiService,
    private descriptionFormatter: ActivityDescriptionFormatterService) {
    super();
    userService.getUser().subscribe(user => {
      this.userId = user?.id ?? "";
    })
  }

  getTaskActivitiesByTaskId(taskId: string) {
    return this.takActivityApi.getTaskActivitiesByTaskId(taskId);
  }
  getBoardActivitiesOnPage(page: number, amountOnPage: number) {
    return this.activityApi.getBoardActivitiesOnPage(page, amountOnPage);
  }
  getBoardActivityAmount() {
    return this.activityApi.getBoardActivitiesAmount();
  }
  async createTaskActivity(activityType: ActivityType, taskActivityData: TaskActivityData) {
    try {
      switch (activityType) {
        case ActivityType.Create:
          return this.createTaskActivity_Create(taskActivityData.task);
        case ActivityType.Update:
          if (!taskActivityData.prevTask)
            throw new Error('To create update activity, define previous task data!');
          await this.createTaskActivity_Update(taskActivityData.task, taskActivityData.prevTask);
          break;
        case ActivityType.Delete:
          if (!taskActivityData.taskList)
            throw new Error('To create delete activity, define task list data!');
          this.createTaskActivity_Delete(taskActivityData.task, taskActivityData.taskList);
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
          return this.createListActivity_Create(listActivityData.taskList);
        case ActivityType.Update:
          if (!listActivityData.prevTaskList)
            throw new Error('To create update activity, define previous task list data!');
          this.createListActivity_Update(listActivityData.taskList, listActivityData.prevTaskList);
          break;
        case ActivityType.Delete:
          this.createListActivity_Delete(listActivityData.taskList);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  private createTaskActivity_Create(task: BoardTask) {
    var descriptions = this.descriptionFormatter.taskCreated(task)
    this.createBoardActivity(descriptions);
    this.createBoardTaskActivity(task, descriptions);
  }
  private async createTaskActivity_Update(curentTask: BoardTask, prevTask: BoardTask) {
    var descriptions = await this.descriptionFormatter.taskUpdated(curentTask, prevTask);
    for (var i = 0; i < descriptions.length; i++) {
      this.createBoardActivity(descriptions[i]);
      this.createBoardTaskActivity(curentTask, descriptions[i]);
    }
  }
  private createTaskActivity_Delete(task: BoardTask, taskList: BoardTaskList) {
    var descriptions = this.descriptionFormatter.taskDeleted(task, taskList)
    this.createBoardActivity(descriptions);
  }
  private createListActivity_Create(taskList: BoardTaskList) {
    var description = this.descriptionFormatter.taskListCreated(taskList)
    this.createBoardActivity(description);
  }
  private createListActivity_Update(currentTaskList: BoardTaskList, prevTaskList: BoardTaskList) {
    var descriptions = this.descriptionFormatter.taskListUpdate(currentTaskList, prevTaskList)
    for (var i = 0; i < descriptions.length; i++) {
      this.createBoardActivity(descriptions[i]);
    }
  }
  private createListActivity_Delete(taskList: BoardTaskList) {
    var description = this.descriptionFormatter.taskListDeleted(taskList)
    this.createBoardActivity(description);
  }
  private createBoardActivity(description: ActivityDescriptions): void;
  private createBoardActivity(description: string): void;
  private createBoardActivity(description: ActivityDescriptions | string): void {
    const activityDescription = typeof description === 'string' ? description : description.activityDescription;
    const boardActivity: BoardActivity = {
      id: "",
      userId: this.userId,
      activityTime: new Date(),
      description: activityDescription
    };
    this.activityApi.createActivity(boardActivity).subscribe(res => { });
  }
  private createBoardTaskActivity(task: BoardTask, description: ActivityDescriptions) {
    const boardTaskActivity: BoardTaskActivity = {
      id: "",
      boardTaskId: task.id,
      activityTime: new Date(),
      description: description.activityTaskDescription
    };
    this.takActivityApi.createTaskActivity(boardTaskActivity).subscribe(res => { });
  }
}
