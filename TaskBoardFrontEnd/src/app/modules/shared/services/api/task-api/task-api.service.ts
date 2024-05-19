import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { BoardTask, CustomErrorHandler, URLDefiner } from '../../../index';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  constructor(private httpClient: HttpClient, private errorHandler: CustomErrorHandler, private urlDefiner: URLDefiner) { }

  getTaskById(taskId: string) {
    return this.httpClient.get<BoardTask>(this.urlDefiner.combineWithApiUrl(`/BoardTask/${taskId}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  createNewTask(task: BoardTask) {
    return this.httpClient.post<BoardTask>(this.urlDefiner.combineWithApiUrl(`/BoardTask`), task).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  updateTask(task: BoardTask, positionIndex: number) {
    return this.httpClient.put(this.urlDefiner.combineWithApiUrl(`/BoardTask?positionIndex=${positionIndex}`), task).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  deleteTask(task: BoardTask) {
    return this.httpClient.delete(this.urlDefiner.combineWithApiUrl(`/BoardTask/${task.id}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  private handleError(error: Error) {
    this.errorHandler.handleError(error);
    return throwError(() => new Error(error.message));
  }
}