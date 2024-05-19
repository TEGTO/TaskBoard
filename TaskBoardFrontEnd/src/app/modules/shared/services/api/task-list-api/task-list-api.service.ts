import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { BoardTaskList, CustomErrorHandler, URLDefiner, UserApiService } from '../../../index';

@Injectable({
  providedIn: 'root'
})
export class TaskListApiService {

  constructor(private httpClient: HttpClient, private userApiService: UserApiService, private errorHandler: CustomErrorHandler, private urlDefiner: URLDefiner) {
  }

  getTaskLists(): Observable<BoardTaskList[]> {
    return this.userApiService.getUser().pipe(
      switchMap(user => {
        if (!user)
          return new Observable<BoardTaskList[]>(observer => observer.next([]));
        return this.httpClient.get<BoardTaskList[]>(this.urlDefiner.combineWithApiUrl(`/BoardTaskLists/user/${user.id}`)).pipe(
          catchError((err) => this.handleError(err))
        );
      }));
  }
  getTaskListById(id: string): Observable<BoardTaskList | undefined> {
    return this.httpClient.get<BoardTaskList>(this.urlDefiner.combineWithApiUrl(`/BoardTaskLists/${id}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  createNewTaskList(taskList: BoardTaskList) {
    return this.userApiService.getUser().pipe(
      switchMap(user => {
        if (!user)
          return new Observable<BoardTaskList>(observer => observer.next());
        taskList = { ...taskList, userId: user.id, creationTime: new Date(), boardTasks: [] };
        return this.httpClient.post<BoardTaskList>(this.urlDefiner.combineWithApiUrl(`/BoardTaskLists`), taskList).pipe(
          catchError((err) => this.handleError(err))
        );
      }));
  }
  updateTaskList(taskList: BoardTaskList) {
    return this.httpClient.put(this.urlDefiner.combineWithApiUrl(`/BoardTaskLists`), taskList).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  deleteTaskList(taskList: BoardTaskList) {
    return this.httpClient.delete(this.urlDefiner.combineWithApiUrl(`/BoardTaskLists/${taskList.id}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  private handleError(error: Error) {
    this.errorHandler.handleError(error);
    return throwError(() => new Error(error.message));
  }
}