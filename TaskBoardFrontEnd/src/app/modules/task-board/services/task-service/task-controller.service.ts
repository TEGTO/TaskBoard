import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ActivityService, TaskActivityData } from '../../../action-history';
import { ActivityType, Board, BoardTask, BoardTaskList, TaskApiService, copyTaskValues } from '../../../shared';
import { ChangeTaskData } from '../../index';
import { TaskService } from './task-service';

@Injectable({
  providedIn: 'root'
})
export class TaskControllerService extends TaskService {

  constructor(private apiService: TaskApiService, private activityService: ActivityService) {
    super();
  }

  createNewTask(data: ChangeTaskData) {
    this.apiService.createNewTask(data.task).subscribe((res) => {
      const taskList = data.allTaskLists.find(x => x.id === res.boardTaskListId);
      if (taskList) {
        copyTaskValues(data.task, res);
        this.updateTaskLists(data, 0);
        this.activityService.createTaskActivity(ActivityType.Create,
          this.createTaskActivityData(data.task, undefined, data.currentTaskList, data.board));
      }
    });
  }
  updateTask(data: ChangeTaskData, currentIndex: number) {
    this.updateTaskLists(data, currentIndex);
    this.apiService.getTaskById(data.task.id).subscribe((prevTask) => {
      this.apiService.updateTask(data.task, currentIndex).subscribe(() => {
        this.activityService.createTaskActivity(ActivityType.Update,
          this.createTaskActivityData(data.task, prevTask, data.currentTaskList, data.board));
      });
    });
  }
  deleteTask(data: ChangeTaskData) {
    this.apiService.deleteTask(data.task.id).subscribe(() => {
      this.deleteTaskFromCurrentTaskList(data);
      this.activityService.createTaskActivity(ActivityType.Delete,
        this.createTaskActivityData(data.task, undefined, data.currentTaskList, data.board));
    });
  }
  private updateTaskLists(data: ChangeTaskData, currentIndex: number) {
    const prevIndex = data.prevTaskList.boardTasks.findIndex((element) => element.id === data.task.id);
    var toUpdateArray: BoardTask[];
    if (data.task.boardTaskListId === data.prevTaskList.id) {
      moveItemInArray(data.prevTaskList.boardTasks, prevIndex, currentIndex);
      toUpdateArray = data.prevTaskList.boardTasks;
    } else {
      transferArrayItem(
        data.prevTaskList.boardTasks,
        data.currentTaskList.boardTasks,
        prevIndex,
        currentIndex,
      );
      toUpdateArray = data.currentTaskList.boardTasks;
    }
    var toUpdateElement = toUpdateArray.find(x => x.id == data.task.id);
    if (toUpdateElement)
      copyTaskValues(toUpdateElement, data.task);
    else
      toUpdateArray.unshift(data.task);
  }
  private deleteTaskFromCurrentTaskList(data: ChangeTaskData) {
    const index: number = data.currentTaskList!.boardTasks.findIndex((element) => element.id === data.task.id);
    if (index !== -1)
      data.currentTaskList!.boardTasks.splice(index, 1);
  }
  private createTaskActivityData(task: BoardTask, prevTask: BoardTask | undefined, currentList: BoardTaskList, board: Board) {
    var data: TaskActivityData = {
      task: task,
      prevTask: prevTask,
      taskList: currentList,
      board: board
    }
    return data;
  }
}