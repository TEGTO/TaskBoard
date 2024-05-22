import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityService } from '../../../action-history';
import { ActivityType, BoardTaskList, TaskListApiService, copyTaskListValues } from '../../../shared';
import { TaskListService } from './task-list-service';

@Injectable({
  providedIn: 'root'
})
export class TaskListControllerService extends TaskListService {

  constructor(private taskListApi: TaskListApiService, private activityService: ActivityService) {
    super();
  }

  getTaskListsByBoardId(id: string): Observable<BoardTaskList[]> {
    return this.taskListApi.getTaskListsByBoardId(id);
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
