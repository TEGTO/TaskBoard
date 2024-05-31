import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardTaskList } from '../../../shared';

@Injectable({
  providedIn: 'root'
})
export abstract class TaskListService {
  abstract getTaskListsByBoardId(id: string): Observable<BoardTaskList[]>;
  abstract getTaskListById(id: string): Observable<BoardTaskList | undefined>;
  abstract createNewTaskList(taskList: BoardTaskList): void;
  abstract updateTaskList(taskList: BoardTaskList): void;
  abstract deleteTaskList(taskList: BoardTaskList): void;
}
