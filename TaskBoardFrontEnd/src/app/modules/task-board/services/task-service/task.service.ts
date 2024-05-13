import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ActivityType } from '../../shared/enums/activity-type.enum';
import { BoardTaskList } from '../../shared/models/board-task-list.model';
import { BoardTask, copyTaskValues } from '../../shared/models/board-task.model';
import { ActivityService } from '../acitvity-service/activity.service';
import { TaskApiService } from '../api/task-api/task-api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private apiService: TaskApiService, private activityService: ActivityService) { }

  createNewTask(task: BoardTask, allTaskLists: BoardTaskList[]) {
    this.apiService.createNewTask(task).subscribe
      ((res) => {
        copyTaskValues(task, res);
        const taskList = allTaskLists.find(x => x.id == task.boardTaskListId)!;
        this.updateTaskLists(task, taskList, taskList, 0);
        this.activityService.createTaskActivity(ActivityType.Create, {
          task: task,
          prevTask: undefined,
          taskList: undefined
        });
      });
  }
  updateTask(task: BoardTask, prevTaskList: BoardTaskList, currentTaskList: BoardTaskList, currentIndex: number) {
    this.updateTaskLists(task, prevTaskList, currentTaskList, currentIndex);
    this.apiService.getTaskById(task.id).subscribe(
      (prevTask) => {
        if (prevTask) {
          this.apiService.updateTask(task, currentIndex).subscribe
            (() => {
              this.activityService.createTaskActivity(ActivityType.Update, {
                task: task,
                prevTask: prevTask,
                taskList: undefined
              });
            });
        }
      }
    );
  }
  deleteTask(task: BoardTask, currentTaskList: BoardTaskList) {
    this.apiService.deleteTask(task).subscribe(
      () => {
        this.deleteTaskFromCurrentTaskList(task, currentTaskList);
        this.activityService.createTaskActivity(ActivityType.Delete, {
          task: task,
          prevTask: undefined,
          taskList: currentTaskList
        });
      }
    );
  }
  private updateTaskLists(task: BoardTask, prevTaskList: BoardTaskList, currentTaskList: BoardTaskList, currentIndex: number) {
    const prevIndex = prevTaskList.boardTasks.findIndex((element) => element.id === task.id);
    var toUpdateArray: BoardTask[];
    if (task.boardTaskListId === prevTaskList.id) {
      moveItemInArray(prevTaskList.boardTasks, prevIndex, currentIndex);
      toUpdateArray = prevTaskList.boardTasks;
    } else {
      transferArrayItem(
        prevTaskList.boardTasks,
        currentTaskList.boardTasks,
        prevIndex,
        currentIndex,
      );
      toUpdateArray = currentTaskList.boardTasks;
    }
    var toUpdateElement = toUpdateArray.find(x => x.id == task.id);
    if (toUpdateElement)
      copyTaskValues(toUpdateElement, task);
    else
      toUpdateArray.unshift(task);
  }
  private deleteTaskFromCurrentTaskList(task: BoardTask, currentTaskList: BoardTaskList) {
    const index: number = currentTaskList.boardTasks.findIndex((element) => element.id === task.id);
    if (index !== -1)
      currentTaskList.boardTasks.splice(index, 1);
  }
}
