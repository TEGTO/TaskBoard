import { Injectable } from '@angular/core';
import { BoardTask, BoardTaskList } from '../../../shared';

@Injectable({
  providedIn: 'root'
})
export abstract class TaskService {
  abstract createTask(task: BoardTask): void;
  abstract updateTask(prevTaskList: BoardTaskList, task: BoardTask, currentIndex: number): void;
  abstract deleteTask(task: BoardTask): void;
}
