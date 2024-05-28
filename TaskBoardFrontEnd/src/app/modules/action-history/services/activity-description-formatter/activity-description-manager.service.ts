import { Inject, Injectable } from '@angular/core';
import { Observable, forkJoin, lastValueFrom } from 'rxjs';
import { BoardTask, BoardTaskList, PriorityConvertorService, StringFormaterService, TaskListApiService } from '../../../shared';
import { ACTIVITY_FORMAT_CONFIG, ActivityFormatConfig } from '../../index';
import { ActivityDescriptionFormatterService, ActivityDescriptions, TaskUpdateActivityData } from './activity-description-formatter-service';

@Injectable({
  providedIn: 'root'
})
export class ActivityDescriptionManagerService extends ActivityDescriptionFormatterService {

  constructor(@Inject(ACTIVITY_FORMAT_CONFIG) private format: ActivityFormatConfig, private taskListApi: TaskListApiService) {
    super();
  }

  taskCreated(task: BoardTask): ActivityDescriptions {
    var names = this.getActivitiesNames(task);
    return this.getActivityDescForStr("You created {0}", names.taskName_Activity, names.taskName_TaskActivity);
  }
  async taskUpdated(curentTask: BoardTask, prevTask: BoardTask) {
    var names = this.getActivitiesNames(curentTask);
    var taskUpdatedParams: TaskUpdateActivityData =
    {
      curentTask: curentTask,
      prevTask: prevTask,
      taskName_Activity: names.taskName_Activity,
      taskName_TaskActivity: names.taskName_TaskActivity,
      updatedElemets: []
    }
    if (prevTask.boardTaskListId != curentTask.boardTaskListId) {
      await lastValueFrom(this.taskUpdated_TaskList(taskUpdatedParams));
    }
    if (prevTask.dueTime != curentTask.dueTime) {
      this.taskUpdate_DueTime(taskUpdatedParams);
    }
    if (prevTask.name != curentTask.name) {
      this.taskUpdate_Name(taskUpdatedParams);
    }
    if (prevTask.description != curentTask.description) {
      this.taskUpdate_Description(taskUpdatedParams);
    }
    if (prevTask.priority != curentTask.priority) {
      this.taskUpdate_Priority(taskUpdatedParams);
    }
    return taskUpdatedParams.updatedElemets;
  }
  taskDeleted(task: BoardTask, taskList: BoardTaskList) {
    var names = this.getActivitiesNames(task);
    var taskListName = this.getFormattedSecondName(taskList?.name);
    return this.getActivityDescForStr(`You removed {0} from ${taskListName}`, names.taskName_Activity, names.taskName_TaskActivity);
  }
  taskListCreated(taskList: BoardTaskList) {
    var name = this.getTaskListName(taskList);
    return `You created ${name}`;
  }
  taskListUpdate(currentTaskList: BoardTaskList, prevTaskList: BoardTaskList) {
    var name = this.getTaskListName(currentTaskList);
    var updatedElemets = [];
    if (currentTaskList.name != prevTaskList.name) {
      var prevName = this.getTaskListName(prevTaskList);
      updatedElemets.push(`You changed name from ${prevName} to ${name}`);
    }
    return updatedElemets;
  }
  taskListDeleted(taskList: BoardTaskList) {
    var name = this.getTaskListName(taskList);
    return `You removed ${name}`;
  }
  private getActivitiesNames(task: BoardTask) {
    var taskName_Activity = this.getFormattedMainName(task.name);
    var taskName_TaskActivity = "this task";
    return { taskName_Activity: taskName_Activity, taskName_TaskActivity: taskName_TaskActivity };
  }
  private getTaskListName(taskList: BoardTaskList) {
    return this.getFormattedSecondName(taskList.name);
  }
  private getFormattedMainName(name: string | undefined): string {
    let mainName = name ? name.slice(0, this.format.maxNameLength) : "";
    if (name && name.length > this.format.maxNameLength) {
      mainName += this.format.maxNameLengthReplacingString;
    }
    mainName = this.deleteSpecialCharacterInName(mainName);
    return `${this.format.mainNameStyleBegin}${mainName}${this.format.mainNameStyleEnd}`;
  }
  private getFormattedSecondName(name: string | undefined) {
    let secondName = name ? name.slice(0, this.format.maxNameLength) : "";
    if (name && name.length > this.format.maxNameLength) {
      secondName += this.format.maxNameLengthReplacingString;
    }
    secondName = this.deleteSpecialCharacterInName(secondName);
    return `${this.format.secondaryNameStyleBegin}${secondName}${this.format.secondaryNameStyleEnd}`;
  }
  private deleteSpecialCharacterInName(name: string) {
    return name.replace(/</g, '');
  }
  private getActivityDescForStr(str: string, taskName: string, taskActivityTaskName: string) {
    return {
      activityDescription: StringFormaterService.format(str, taskName),
      activityTaskDescription: StringFormaterService.format(str, taskActivityTaskName)
    };
  }

  // The Twilight Zone

  private taskUpdated_TaskList(taskParams: TaskUpdateActivityData): Observable<void> {
    return new Observable<void>((observer) => {
      forkJoin([
        this.taskListApi.getTaskListById(taskParams.prevTask.boardTaskListId),
        this.taskListApi.getTaskListById(taskParams.curentTask.boardTaskListId)
      ]).subscribe(([prevList, currentList]) => {
        if (prevList && currentList) {
          var prevListName = this.getTaskListName(prevList);
          var currentListName = this.getTaskListName(currentList);
          taskParams.updatedElemets.push(this.getActivityDescForStr(`You moved {0} from ${prevListName} to ${currentListName}`,
            taskParams.taskName_Activity, taskParams.taskName_TaskActivity));
        }
        observer.next();
        observer.complete();
      });
    });
  }
  private taskUpdate_DueTime(taskParams: TaskUpdateActivityData) {
    var prevDueTime = this.getFormattedSecondName(taskParams.prevTask.dueTime?.toLocaleDateString());
    var currentDueTime = this.getFormattedSecondName(taskParams.curentTask.dueTime?.toLocaleDateString());
    taskParams.updatedElemets.push(this.getActivityDescForStr(`You changed {0} due time from ${prevDueTime} to ${currentDueTime}`,
      taskParams.taskName_Activity, taskParams.taskName_TaskActivity));
  }
  private taskUpdate_Name(taskParams: TaskUpdateActivityData) {
    var prevName = this.getFormattedMainName(taskParams.prevTask.name);
    taskParams.updatedElemets.push(this.getActivityDescForStr(`You changed name from ${prevName} to {0}`,
      taskParams.taskName_Activity, taskParams.taskName_Activity));
  }
  private taskUpdate_Description(taskParams: TaskUpdateActivityData) {
    taskParams.updatedElemets.push(this.getActivityDescForStr(`You changed {0} description`,
      taskParams.taskName_Activity, taskParams.taskName_TaskActivity));
  }
  private taskUpdate_Priority(taskParams: TaskUpdateActivityData) {
    var prevPriority = this.getFormattedSecondName(PriorityConvertorService.getPriorityString(taskParams.prevTask.priority));
    var currentPriority = this.getFormattedSecondName(PriorityConvertorService.getPriorityString(taskParams.curentTask.priority));
    taskParams.updatedElemets.push(this.getActivityDescForStr(`You changed {0} priority from ${prevPriority} to ${currentPriority}`,
      taskParams.taskName_Activity, taskParams.taskName_TaskActivity));
  }
}