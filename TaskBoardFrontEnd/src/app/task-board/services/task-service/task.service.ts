import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
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
        this.activityService.createActivity_TaskCreated(task);
      });
  }
  getUpdatedDragDropTask(event: CdkDragDrop<BoardTaskList>) {
    var currentIndex = event.currentIndex;
    var nextTask = event.container.data.boardTasks.at(currentIndex);
    var prevTask = currentIndex > 0 ? event.container.data.boardTasks.at(currentIndex - 1) : undefined;
    var updatedTask: BoardTask = {
      ...event.item.data,
      boardTaskListId: event.container.data.id,
      nextTaskId: nextTask?.id,
      prevTaskId: prevTask?.id
    };
    return updatedTask;
  }
  updateTask(task: BoardTask, allTaskLists: BoardTaskList[], newIndex: number | undefined = undefined) {
    var prevTask: BoardTask;
    this.apiService.getTaskById(task.id).subscribe(
      (res) => {
        prevTask = res;
        if (prevTask) {
          this.apiService.updateTask(task).subscribe
            (() => {
              if (newIndex) {
                const prevTaskList = allTaskLists.find(x => x.id == prevTask.boardTaskListId)!;
                const currentTaskList = allTaskLists.find(x => x.id == task.boardTaskListId)!;
                this.updateTaskLists(task, prevTaskList, currentTaskList, newIndex);
              }
              this.activityService.createActivity_TaskUpdated(task, prevTask);
            });
        }
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
  updateTaskLists(task: BoardTask, prevTaskList: BoardTaskList, currentTaskList: BoardTaskList, currentIndex: number) {
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
