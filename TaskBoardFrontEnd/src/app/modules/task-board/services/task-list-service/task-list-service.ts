import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardTaskList } from '../../../shared';

@Injectable({
  providedIn: 'root'
})
export abstract class TaskListService {
  abstract getTaskLists(): Observable<BoardTaskList[]>;
  abstract getTaskListById(id: string): Observable<BoardTaskList | undefined>;
  abstract createNewTaskList(taskList: BoardTaskList | undefined, allTaskLists: BoardTaskList[]): void;
  abstract updateTaskList(taskList: BoardTaskList | undefined): void;
  abstract deleteTaskList(taskList: BoardTaskList | undefined, allTaskLists: BoardTaskList[]): void;
}
