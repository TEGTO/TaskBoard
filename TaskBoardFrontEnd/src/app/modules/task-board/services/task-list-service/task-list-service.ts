import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardTaskList } from '../../../shared';
import { ChangeTaskListData } from '../../index';

@Injectable({
  providedIn: 'root'
})
export abstract class TaskListService {
  abstract getTaskListsByBoardId(id: string): Observable<BoardTaskList[]>;
  abstract getTaskListById(id: string): Observable<BoardTaskList | undefined>;
  abstract createNewTaskList(changeTaskListData: ChangeTaskListData): void;
  abstract updateTaskList(changeTaskListData: ChangeTaskListData): void;
  abstract deleteTaskList(data: ChangeTaskListData): void;
}
