import { Injectable } from '@angular/core';
import { BoardTask, BoardTaskList } from '../../../shared';

export interface ActivityDescriptions {
  activityDescription: string;
  activityTaskDescription: string;
}
export interface TaskUpdateActivityData {
  curentTask: BoardTask,
  prevTask: BoardTask,
  taskName_Activity: string,
  taskName_TaskActivity: string,
  updatedElemets: ActivityDescriptions[]
}

@Injectable({
  providedIn: 'root'
})
export abstract class ActivityDescriptionFormatterService {

  abstract taskCreated(task: BoardTask): ActivityDescriptions;
  abstract taskUpdated(curentTask: BoardTask, prevTask: BoardTask): Promise<ActivityDescriptions[]>;
  abstract taskDeleted(task: BoardTask, taskList: BoardTaskList): {
    activityDescription: string;
    activityTaskDescription: string;
  };
  abstract taskListCreated(taskList: BoardTaskList): string;
  abstract taskListUpdate(currentTaskList: BoardTaskList, prevTaskList: BoardTaskList): string[];
  abstract taskListDeleted(taskList: BoardTaskList): string;
}
