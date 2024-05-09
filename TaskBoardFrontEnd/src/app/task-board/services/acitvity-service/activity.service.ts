import { Injectable } from '@angular/core';
import { BoardActivity } from '../../../shared/models/board-activity.model';
import { BoardTaskActivity } from '../../../shared/models/board-task-activity.model';
import { BoardTaskList } from '../../../shared/models/board-task-list.model';
import { BoardTask } from '../../../shared/models/board-task.model';
import { ActivityDescriptionFormatterService, ActivityDescriptions } from '../activity-description-formatter/activity-description-formatter.service';
import { ActivityApiService } from '../api/acitvity-api/activity-api.service';
import { TaskActivityApiService } from '../api/task-acitvity-api/task-activity-api.service';
import { UserApiService } from '../api/user-api/user-api.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private userId: string = "";

  constructor(
    private userService: UserApiService,
    private activityApi: ActivityApiService,
    private takActivityApi: TaskActivityApiService,
    private descriptionFormatter: ActivityDescriptionFormatterService) {
    userService.getUser().subscribe(user => {
      this.userId = user.id;
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
  createActivity_TaskCreated(task: BoardTask) {
    var descriptions = this.descriptionFormatter.taskCreated(task)
    this.createBoardActivity(descriptions);
    this.createBoardTaskActivity(task, descriptions);
  }
  async createActivity_TaskUpdated(curentTask: BoardTask, prevTask: BoardTask) {
    var descriptions = await this.descriptionFormatter.taskUpdated(curentTask, prevTask);
    console.log(descriptions);
    console.log(descriptions.length);
    for (var i = 0; i < descriptions.length; i++) {
      this.createBoardActivity(descriptions[i]);
      this.createBoardTaskActivity(curentTask, descriptions[i]);
    }
  }
  createActivity_TaskDeleted(task: BoardTask, taskList: BoardTaskList) {
    var descriptions = this.descriptionFormatter.taskDeleted(task, taskList)
    this.createBoardActivity(descriptions);
    this.createBoardTaskActivity(task, descriptions);
  }
  createActivity_TaskListCreated(taskList: BoardTaskList) {
    var description = this.descriptionFormatter.taskListCreated(taskList)
    this.createBoardActivity(description);
  }
  createActivity_TaskListUpdated(currentTaskList: BoardTaskList, prevTaskList: BoardTaskList) {
    var descriptions = this.descriptionFormatter.taskListUpdate(currentTaskList, prevTaskList)
    for (var i = 0; i < descriptions.length; i++) {
      this.createBoardActivity(descriptions[i]);
    }
  }
  createActivity_TaskListDeleted(taskList: BoardTaskList) {
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
