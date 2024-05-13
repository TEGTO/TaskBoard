import { Injectable } from '@angular/core';
import { ActivityType } from '../../shared/enums/activity-type.enum';
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
        this.activityService.createTaskListActivity(ActivityType.Create, {
          taskList: taskList,
          prevTaskList: undefined
        });
      });
    }
  }
  updateTaskList(taskList: BoardTaskList | undefined) {
    if (taskList) {
      this.getTaskListById(taskList.id).subscribe(prevTaskList => {
        this.taskListApi.updateTaskList(taskList).subscribe(() => {
          this.activityService.createTaskListActivity(ActivityType.Update, {
            taskList: taskList,
            prevTaskList: prevTaskList
          });
        });
      });
    }
  }
  deleteTaskList(taskList: BoardTaskList | undefined, allTaskLists: BoardTaskList[]) {
    if (taskList) {
      this.taskListApi.deleteTaskList(taskList).subscribe(() => {
        this.deleteTaskListFromArray(taskList, allTaskLists);
        this.activityService.createTaskListActivity(ActivityType.Delete, {
          taskList: taskList,
          prevTaskList: undefined
        });
      });
    }
  }
  private deleteTaskListFromArray(taskList: BoardTaskList, allTaskLists: BoardTaskList[]) {
    const index: number = allTaskLists.indexOf(taskList);
    if (index !== -1)
      allTaskLists.splice(index, 1);
  }
}
