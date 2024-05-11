import { Injectable } from '@angular/core';
import { BoardTaskList, copyTaskListValues } from '../../shared/models/board-task-list.model';
import { ActivityService } from '../acitvity-service/activity.service';
import { TaskListApiService } from '../api/task-list-api/task-list-api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  constructor(private taskListApi: TaskListApiService, private activityService: ActivityService) { }

  getTaskLists() {
    return this.taskListApi.getTaskLists();
  }
  getTaskListById(id: string) {
    return this.taskListApi.getTaskListById(id);
  }
  createNewTaskList(taskList: BoardTaskList | undefined, allTaskLists: BoardTaskList[]) {
    if (taskList) {
      this.taskListApi.createNewTaskList(taskList).subscribe(res => {
        copyTaskListValues(taskList, res);
        allTaskLists.push(taskList);
        this.activityService.createActivity_TaskListCreated(taskList);
      });
    }
  }
  updateTaskList(taskList: BoardTaskList | undefined) {
    if (taskList) {
      this.getTaskListById(taskList.id).subscribe(prevTaskList => {
        this.taskListApi.updateTaskList(taskList).subscribe(() => {
          this.activityService.createActivity_TaskListUpdated(taskList, prevTaskList!);
        });
      });
    }
  }
  deleteTaskList(taskList: BoardTaskList | undefined, allTaskLists: BoardTaskList[]) {
    if (taskList) {
      this.taskListApi.deleteTaskList(taskList).subscribe(() => {
        this.deleteTaskListFromArray(taskList, allTaskLists);
        this.activityService.createActivity_TaskListDeleted(taskList);
      });
    }
  }
  private deleteTaskListFromArray(taskList: BoardTaskList, allTaskLists: BoardTaskList[]) {
    const index: number = allTaskLists.indexOf(taskList);
    if (index !== -1)
      allTaskLists.splice(index, 1);
  }
}
