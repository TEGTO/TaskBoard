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
  getTasksByListId(id: string) {
    return this.getHttpClient().get<BoardTask[]>(this.combinePathWithApiUrl(`/BoardTask/list/${id}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  createNewTask(task: BoardTask) {
    this.validateTask_Create(task);
    task = { ...task, creationTime: new Date() };
    return this.getHttpClient().post<BoardTask>(this.combinePathWithApiUrl(`/BoardTask`), task).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  updateTask(task: BoardTask, positionIndex: number) {
    this.validateTask_Update(task);
    return this.getHttpClient().put(this.combinePathWithApiUrl(`/BoardTask?positionIndex=${positionIndex}`), task).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  deleteTask(id: string) {
    return this.getHttpClient().delete(this.combinePathWithApiUrl(`/BoardTask/${id}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  private validateTask_Create(task: BoardTask) {
    if (!task.boardTaskListId)
      throw new Error("Task List Id is not set!");
    else if (task.priority === undefined)
      throw new Error("Priority is not set!");
  }
  private validateTask_Update(task: BoardTask) {
    if (!task.id)
      throw new Error("Id is not set!");
    else if (!task.boardTaskListId)
      throw new Error("Task List Id is not set!");
    else if (!task.creationTime)
      throw new Error("Creation time is not set!");
    else if (task.priority === undefined)
      throw new Error("Priority is not set!");
  }
}