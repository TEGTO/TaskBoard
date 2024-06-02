import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BoardTaskList, TaskListApiService } from '../../../shared';
import { createTaskList, deleteTaskList, getTaskListsByBoardId, selectAllTaskLists, updateTaskList } from '../../index';
import { TaskListService } from './task-list-service';

@Injectable({
  providedIn: 'root'
})
export class TaskListControllerService implements TaskListService {

  constructor(private store: Store<{ taskListState: { taskLists: BoardTaskList[] } }>,
    private taskListApi: TaskListApiService) { }

  getTaskListsByBoardId(id: string): Observable<BoardTaskList[]> {
    this.store.dispatch(getTaskListsByBoardId({ boardId: id }));
    var taskLists$ = this.store.select(selectAllTaskLists);
    return taskLists$;
  }
  getTaskListById(id: string) {
    return this.taskListApi.getTaskListById(id);
  }
  createTaskList(taskList: BoardTaskList) {
    this.store.dispatch(createTaskList({ taskList }));
  }
  updateTaskList(taskList: BoardTaskList) {
    this.store.dispatch(updateTaskList({ taskList }));
  }
  deleteTaskList(taskList: BoardTaskList) {
    this.store.dispatch(deleteTaskList({ listId: taskList.id }));
  }
}
