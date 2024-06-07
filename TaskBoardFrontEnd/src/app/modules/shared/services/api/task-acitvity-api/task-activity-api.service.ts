import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { BaseApiService, BoardTaskActivity } from '../../../index';

@Injectable({
  providedIn: 'root'
})
export class TaskActivityApiService extends BaseApiService {

  getTaskActivitiesByTaskId(taskId: string) {
    return this.getHttpClient().get<BoardTaskActivity[]>(this.combinePathWithApiUrl(`/BoardTaskActivity/taskActivities/${taskId}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  createTaskActivity(acitvity: BoardTaskActivity) {
    return this.getHttpClient().post<BoardTaskActivity>(this.combinePathWithApiUrl(`/BoardTaskActivity`), acitvity).pipe(
      catchError((err) => this.handleError(err))
    );
  }
}
