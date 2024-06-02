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
  createTaskList(taskList: BoardTaskList) {
    taskList = { ...taskList, creationTime: new Date(), boardTasks: [] };
    this.validateTaskList_Create(taskList);
    return this.getHttpClient().post<BoardTaskList>(this.combinePathWithApiUrl(`/BoardTaskList`), taskList).pipe(
      catchError((err) => this.handleError(err)));
  }
  updateTaskList(taskList: BoardTaskList) {
    this.validateTaskList_Update(taskList);
    return this.getHttpClient().put(this.combinePathWithApiUrl(`/BoardTaskList`), taskList).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  deleteTaskList(id: string) {
    return this.getHttpClient().delete(this.combinePathWithApiUrl(`/BoardTaskList/${id}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  private validateTaskList_Create(taskList: BoardTaskList) {
    if (!taskList.boardId)
      throw new Error("Board Id is not set!");
  }
  private validateTaskList_Update(taskList: BoardTaskList) {
    if (!taskList.id)
      throw new Error("Id is not set!");
    else if (!taskList.creationTime)
      throw new Error("Creation time is not set!");
    else if (!taskList.boardTasks)
      throw new Error("Board tasks is not set!");
    else if (!taskList.boardId)
      throw new Error("Board Id is not set!");
  }
}