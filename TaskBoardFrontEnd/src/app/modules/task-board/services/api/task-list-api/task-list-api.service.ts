import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { BoardTaskList } from '../../../shared/models/board-task-list.model';
import { UserApiService } from '../user-api/user-api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskListApiService {

  constructor(private httpClient: HttpClient, private userApiService: UserApiService) {
  }

  getTaskLists(): Observable<BoardTaskList[]> {
    return this.userApiService.getUser().pipe(
      switchMap(user => {
        if (!user)
          return new Observable<BoardTaskList[]>(observer => observer.next([]));
        return this.httpClient.get<BoardTaskList[]>(`/api/BoardTaskLists/user/${user.id}`);
      }));
  }
  getTaskListById(id: string): Observable<BoardTaskList | undefined> {
    return this.httpClient.get<BoardTaskList>(`/api/BoardTaskLists/${id}`);
  }
  createNewTaskList(taskList: BoardTaskList) {
    return this.userApiService.getUser().pipe(
      switchMap(user => {
        if (!user)
          return new Observable<BoardTaskList>(observer => observer.next());
        taskList = { ...taskList, userId: user.id, creationTime: new Date(), boardTasks: [] };
        return this.httpClient.post<BoardTaskList>(`/api/BoardTaskLists`, taskList);
      }));
  }
  updateTaskList(taskList: BoardTaskList) {
    return this.httpClient.put(`/api/BoardTaskLists`, taskList);
  }
  deleteTaskList(taskList: BoardTaskList) {
    return this.httpClient.delete(`/api/BoardTaskLists/${taskList.id}`);
  }
}