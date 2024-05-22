import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { BaseApiService, BoardTask } from '../../../index';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService extends BaseApiService {

  getTaskById(taskId: string) {
    return this.getHttpClient().get<BoardTask>(this.combinePathWithApiUrl(`/BoardTask/${taskId}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  createNewTask(task: BoardTask) {
    return this.getHttpClient().post<BoardTask>(this.combinePathWithApiUrl(`/BoardTask`), task).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  updateTask(task: BoardTask, positionIndex: number) {
    return this.getHttpClient().put(this.combinePathWithApiUrl(`/BoardTask?positionIndex=${positionIndex}`), task).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  deleteTask(task: BoardTask) {
    return this.getHttpClient().delete(this.combinePathWithApiUrl(`/BoardTask/${task.id}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
}