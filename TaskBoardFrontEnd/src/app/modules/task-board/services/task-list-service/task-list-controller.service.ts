import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityService } from '../../../action-history';
import { ActivityType, BoardTaskList, TaskListApiService, copyTaskListValues } from '../../../shared';
import { ChangeTaskListData } from '../../index';
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
  createNewTaskList(data: ChangeTaskListData) {
    data.taskList.boardId = data.board.id;
    this.taskListApi.createNewTaskList(data.taskList).subscribe(res => {
      copyTaskListValues(data.taskList, res);
      data.allTaskLists.push(data.taskList);
      this.activityService.createTaskListActivity(ActivityType.Create, {
        taskList: data.taskList,
        prevTaskList: undefined,
        board: data.board
      });
    });
  }
  updateTaskList(data: ChangeTaskListData) {
    this.getTaskListById(data.taskList.id).subscribe(taskListInApi => {
      if (taskListInApi) {
        this.taskListApi.updateTaskList(data.taskList).subscribe(() => {
          this.activityService.createTaskListActivity(ActivityType.Update, {
            taskList: data.taskList,
            prevTaskList: taskListInApi,
            board: data.board
          });
        });
      }
    });
  }
  deleteTaskList(data: ChangeTaskListData) {
    if (data.taskList.id) {
      this.taskListApi.deleteTaskList(data.taskList.id).subscribe(() => {
        this.deleteTaskListFromArray(data);
        this.activityService.createTaskListActivity(ActivityType.Delete, {
          taskList: data.taskList,
          prevTaskList: undefined,
          board: data.board
        });
      });
    }
  }
  private deleteTaskListFromArray(data: ChangeTaskListData) {
    const index: number = data.allTaskLists.indexOf(data.taskList);
    if (index !== -1)
      data.allTaskLists.splice(index, 1);
  }
}
