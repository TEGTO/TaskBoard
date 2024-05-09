import { Injectable } from '@angular/core';
import { BoardTaskList } from '../../../shared/models/board-task-list.model';
import { BoardTask, copyTaskValues } from '../../../shared/models/board-task.model';
import { ActivityService } from '../acitvity-service/activity.service';
import { TaskApiService } from '../api/task-api/task-api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private apiService: TaskApiService, private activityService: ActivityService) { }

  createNewTask(task: BoardTask, allTasksLists: BoardTaskList[]) {
    this.apiService.createNewTask(task).subscribe
      ((res) => {
        copyTaskValues(task, res);
        this.updateNewTaskList(task, allTasksLists);
        this.activityService.createActivity_TaskCreated(task);
      });
  }
  updateTask(task: BoardTask, allTasksLists: BoardTaskList[], currentTaskList: BoardTaskList | undefined) {
    var prevTask: BoardTask;
    this.apiService.getTaskById(task.id).subscribe(
      (res) => {
        prevTask = res;
        if (prevTask)
          this.apiService.updateTask(task).subscribe
            (() => {
              if (task.boardTaskListId !== currentTaskList?.id) {
                this.deleteTaskFromCurrentTaskList(task, currentTaskList);
                this.updateNewTaskList(task, allTasksLists);
              }
              this.activityService.createActivity_TaskUpdated(task, prevTask);
            });
      }
    )
  }
  deleteTask(task: BoardTask, currentTaskList: BoardTaskList) {
    this.apiService.deleteTask(task).subscribe(
      () => {
        this.deleteTaskFromCurrentTaskList(task, currentTaskList);
        this.activityService.createActivity_TaskDeleted(task, currentTaskList);
      }
    );
  }
  private updateNewTaskList(task: BoardTask, allTasksLists: BoardTaskList[]) {
    const buffer = allTasksLists.find(x => x.id === task.boardTaskListId)!;
    buffer.boardTasks = buffer.boardTasks ? buffer.boardTasks : [];
    buffer.boardTasks.unshift(task);
  }
  private deleteTaskFromCurrentTaskList(task: BoardTask, currentTaskList: BoardTaskList | undefined) {
    if (currentTaskList) {
      const index: number = currentTaskList.boardTasks.indexOf(task);
      if (index !== -1)
        currentTaskList.boardTasks.splice(index, 1);
    }
  }
}
