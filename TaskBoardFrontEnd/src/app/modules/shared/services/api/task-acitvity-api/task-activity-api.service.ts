import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { BoardTaskActivity, CustomErrorHandler, URLDefiner } from '../../../index';

@Injectable({
  providedIn: 'root'
})
export class TaskActivityApiService {

  constructor(private httpClient: HttpClient, private errorHandler: CustomErrorHandler, private urlDefiner: URLDefiner) { }

  getTaskActivitiesByTaskId(taskId: string) {
    return this.httpClient.get<BoardTaskActivity[]>(this.urlDefiner.combineWithApiUrl(`/BoardTaskActivity/taskActivities/${taskId}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  createTaskActivity(acitvity: BoardTaskActivity) {
    return this.httpClient.post<BoardTaskActivity>(this.urlDefiner.combineWithApiUrl(`/BoardTaskActivity`), acitvity).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  private handleError(error: Error) {
    this.errorHandler.handleError(error);
    return throwError(() => new Error(error.message));
  }
}
