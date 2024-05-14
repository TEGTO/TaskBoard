import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoardTask } from '../../../models/board-task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  constructor(private httpClient: HttpClient) { }

  getTaskById(taskId: string) {
    return this.httpClient.get<BoardTask>(`/api/BoardTask/${taskId}`);
  }
  createNewTask(task: BoardTask) {
    return this.httpClient.post<BoardTask>(`/api/BoardTask`, task);
  }
  updateTask(task: BoardTask, positionIndex: number) {
    return this.httpClient.put(`/api/BoardTask?positionIndex=${positionIndex}`, task);
  }
  deleteTask(task: BoardTask) {
    return this.httpClient.delete(`/api/BoardTask/${task.id}`);
  }
}