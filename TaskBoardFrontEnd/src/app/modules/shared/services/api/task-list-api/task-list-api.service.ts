import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { BaseApiService, BoardTaskList } from '../../../index';

@Injectable({
  providedIn: 'root'
})
export class TaskListApiService extends BaseApiService {

  getTaskListsByBoardId(boardId: string): Observable<BoardTaskList[]> {
    return this.getHttpClient().get<BoardTaskList[]>(this.combinePathWithApiUrl(`/BoardTaskList/board/${boardId}`)).pipe(
      catchError((err) => this.handleError(err)));
  }
  getTaskListById(id: string): Observable<BoardTaskList | undefined> {
    return this.getHttpClient().get<BoardTaskList>(this.combinePathWithApiUrl(`/BoardTaskList/${id}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  createNewTaskList(taskList: BoardTaskList) {
    taskList = { ...taskList, creationTime: new Date(), boardTasks: [] };
    return this.getHttpClient().post<BoardTaskList>(this.combinePathWithApiUrl(`/BoardTaskList`), taskList).pipe(
      catchError((err) => this.handleError(err)));
  }
  updateTaskList(taskList: BoardTaskList) {
    return this.getHttpClient().put(this.combinePathWithApiUrl(`/BoardTaskList`), taskList).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  deleteTaskList(taskList: BoardTaskList) {
    return this.getHttpClient().delete(this.combinePathWithApiUrl(`/BoardTaskList/${taskList.id}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
}