import { Inject, Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { BoardTaskList } from '../../../shared/models/board-task-list.model';
import { BoardTask } from '../../../shared/models/board-task.model';
import { ActivityFormatConfig } from '../../../shared/services/configs/activity-format-config/activity-format-config';
import { ACTIVITY_FORMAT_CONFIG } from '../../../shared/services/configs/activity-format-config/activity-format-config.service';
import { PriorityConvertorService } from '../../../shared/services/priority-convertor/priority-convertor.service';
import { StringFormatService } from '../../../shared/services/string-format/string-format.service';
import { TaskListApiService } from '../api/task-list-api/task-list-api.service';

export interface ActivityDescriptions {
  activityDescription: string;
  activityTaskDescription: string;
}
interface TaskUpdatedParams {
  curentTask: BoardTask,
  prevTask: BoardTask,
  taskName_Activity: string,
  taskName_TaskActivity: string,
  updatedElemets: ActivityDescriptions[]
}

@Injectable({
  providedIn: 'root'
})
export class ActivityDescriptionFormatterService {

  constructor(@Inject(ACTIVITY_FORMAT_CONFIG) private format: ActivityFormatConfig, private taskListApi: TaskListApiService) { }

  taskCreated(task: BoardTask): ActivityDescriptions {
    var names = this.getActivitiesNames(task);
    return this.getActivityDescForStr("You created {0} task", names.taskName_Activity, names.taskName_TaskActivity);
  }
  async taskUpdated(curentTask: BoardTask, prevTask: BoardTask) {
    var names = this.getActivitiesNames(curentTask);
    var taskUpdatedParams: TaskUpdatedParams =
    {
      curentTask: curentTask,
      prevTask: prevTask,
      taskName_Activity: names.taskName_Activity,
      taskName_TaskActivity: names.taskName_TaskActivity,
      updatedElemets: []
    }
    if (prevTask.boardTaskListId != curentTask.boardTaskListId) {
      await this.taskUpdated_TaskList(taskUpdatedParams).toPromise();
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
    return this.getActivityDescForStr(`You removed {0} task from ${taskList?.name}`, names.taskName_Activity, names.taskName_TaskActivity);
  }
  taskListCreated(taskList: BoardTaskList) {
    var name = this.getTaskListName(taskList);
    return `You created ${name} task list`;
  }
  taskListUpdate(prevTaskList: BoardTaskList, currentTaskList: BoardTaskList) {
    var name = this.getTaskListName(currentTaskList);
    var updatedElemets = [];
    if (prevTaskList.name != currentTaskList.name) {
      var prevName = this.getTaskListName(currentTaskList);
      updatedElemets.push(`You changed task list name from ${prevName} to ${name}`);
    }
    return updatedElemets;
  }
  taskListDeleted(taskList: BoardTaskList) {
    var name = this.getTaskListName(taskList);
    return `You deleted ${name} task list`;
  }
  private getActivitiesNames(task: BoardTask) {
    var taskName_Activity = this.getFormattedMainName(task.name);
    var taskName_TaskActivity = "this";
    return { taskName_Activity: taskName_Activity, taskName_TaskActivity: taskName_TaskActivity };
  }
  private getTaskListName(taskList: BoardTaskList) {
    return this.getFormattedMainName(taskList.name);
  }
  private getFormattedMainName(name: string | undefined) {
    var mainName = name ? name : "";
    mainName = this.deleteSpecialCharacterInName(mainName);
    return `${this.format.mainNameStyleBegin}${mainName}${this.format.mainNameStyleEnd}`;
  }
  private getFormattedSecondName(name: string | undefined) {
    var secondName = name ? name : "";
    secondName = this.deleteSpecialCharacterInName(secondName);
    return `${this.format.secondaryNameStyleBegin}${secondName}${this.format.secondaryNameStyleEnd}`;
  }
  private deleteSpecialCharacterInName(name: string) {
    return name.replace(/</g, '');
  }
  private getActivityDescForStr(str: string, taskName: string, taskActivityTaskName: string) {
    return {
      activityDescription: StringFormatService.format(str, taskName),
      activityTaskDescription: StringFormatService.format(str, taskActivityTaskName)
    };
  }

  // The Twilight Zone

  private taskUpdated_TaskList(taskParams: TaskUpdatedParams): Observable<void> {
    return new Observable<void>((observer) => {
      forkJoin([
        this.taskListApi.getTaskListById(taskParams.prevTask.boardTaskListId),
        this.taskListApi.getTaskListById(taskParams.curentTask.boardTaskListId)
      ]).subscribe(([prevList, currentList]) => {
        if (prevList && currentList) {
          var prevListName = this.getFormattedSecondName(prevList.name);
          var currentListName = this.getFormattedSecondName(currentList.name);
          taskParams.updatedElemets.push(this.getActivityDescForStr(`You moved {0} task from ${prevListName} to ${currentListName}`,
            taskParams.taskName_Activity, taskParams.taskName_TaskActivity));
          console.log(taskParams.updatedElemets.length);
        }
        observer.next();
        observer.complete();
      });
    });
  }
  private taskUpdate_DueTime(taskParams: TaskUpdatedParams) {
    var prevPriority = this.getFormattedSecondName(taskParams.prevTask.dueTime?.toLocaleDateString());
    var currentDueTime = this.getFormattedSecondName(taskParams.curentTask.dueTime?.toLocaleDateString());
    taskParams.updatedElemets.push(this.getActivityDescForStr(`You changed {0} task due time from ${prevPriority} to ${currentDueTime}`,
      taskParams.taskName_Activity, taskParams.taskName_TaskActivity));
  }
  private taskUpdate_Name(taskParams: TaskUpdatedParams) {
    var prevPriority = this.getFormattedSecondName(taskParams.prevTask.name);
    taskParams.updatedElemets.push(this.getActivityDescForStr(`You changed task name from ${prevPriority} to {0}`,
      taskParams.taskName_Activity, taskParams.taskName_Activity));
  }
  private taskUpdate_Description(taskParams: TaskUpdatedParams) {
    taskParams.updatedElemets.push(this.getActivityDescForStr(`You changed {0} task description`,
      taskParams.taskName_Activity, taskParams.taskName_TaskActivity));
  }
  private taskUpdate_Priority(taskParams: TaskUpdatedParams) {
    var prevPriority = this.getFormattedSecondName(PriorityConvertorService.getPriorityString(taskParams.prevTask.priority));
    var currentPriority = this.getFormattedSecondName(PriorityConvertorService.getPriorityString(taskParams.curentTask.priority));
    taskParams.updatedElemets.push(this.getActivityDescForStr(`You changed {0} priority from ${prevPriority} to ${currentPriority}`,
      taskParams.taskName_Activity, taskParams.taskName_TaskActivity));
  }
}
