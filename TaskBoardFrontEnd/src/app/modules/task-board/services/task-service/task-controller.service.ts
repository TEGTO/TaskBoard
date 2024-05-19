import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ActivityService } from '../../../action-history';
import { ActivityType, BoardTask, BoardTaskList, CustomErrorHandler, TaskApiService, copyTaskValues } from '../../../shared';
import { TaskService } from './task-service';

@Injectable({
  providedIn: 'root'
})
export class TaskControllerService extends TaskService {

  constructor(private apiService: TaskApiService, private activityService: ActivityService, private errorHandler: CustomErrorHandler) {
    super();
  }

  createNewTask(task: BoardTask, allTaskLists: BoardTaskList[]) {
    this.apiService.createNewTask(task)
      .pipe(
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      )
      .subscribe
      ((res) => {
        if (res) {
          copyTaskValues(task, res);
          const taskList = allTaskLists.find(x => x.id === task.boardTaskListId);
          if (taskList) {
            this.updateTaskLists(task, taskList, taskList, 0);
            this.activityService.createTaskActivity(ActivityType.Create, {
              task: task,
              prevTask: undefined,
              taskList: undefined
            });
          }
        } else {
          console.log('Task creation failed due to an error.');
        }
      });
  }
  updateTask(task: BoardTask, prevTaskList: BoardTaskList, currentTaskList: BoardTaskList, currentIndex: number) {
    this.updateTaskLists(task, prevTaskList, currentTaskList, currentIndex);
    this.apiService.getTaskById(task.id).pipe(
      catchError(err => {
        this.handleError(err);
        return of(null);
      })
    ).subscribe((prevTask) => {
      if (prevTask) {
        this.apiService.updateTask(task, currentIndex).pipe(
          catchError(err => {
            this.handleError(err);
            return of(null);
          })
        ).subscribe(() => {
          this.activityService.createTaskActivity(ActivityType.Update, {
            task: task,
            prevTask: prevTask,
            taskList: undefined
          });
        });
      } else {
        console.log('Previous task not found or error occurred while fetching the task.');
      }
    });
  }
  deleteTask(task: BoardTask, currentTaskList: BoardTaskList) {
    this.apiService.deleteTask(task).pipe(
      catchError(err => {
        this.handleError(err);
        return of(null);
      })
    ).subscribe(() => {
      this.deleteTaskFromCurrentTaskList(task, currentTaskList);
      this.activityService.createTaskActivity(ActivityType.Delete, {
        task: task,
        prevTask: undefined,
        taskList: currentTaskList
      });
    });
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
  private handleError(error: Error) {
    this.errorHandler.handleError(error);
  }
}