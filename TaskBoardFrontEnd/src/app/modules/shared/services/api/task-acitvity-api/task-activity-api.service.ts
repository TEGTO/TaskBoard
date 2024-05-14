import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoardTaskActivity } from '../../../models/board-task-activity.model';

@Injectable({
  providedIn: 'root'
})
export class TaskActivityApiService {

  constructor(private httpClient: HttpClient) { }

  getTaskActivitiesByTaskId(taskId: string) {
    return this.httpClient.get<BoardTaskActivity[]>(`/api/BoardTaskActivity/taskActivities/${taskId}`);
  }
  createTaskActivity(acitvity: BoardTaskActivity) {
    return this.httpClient.post<BoardTaskActivity>(`/api/BoardTaskActivity`, acitvity);
  }
}
