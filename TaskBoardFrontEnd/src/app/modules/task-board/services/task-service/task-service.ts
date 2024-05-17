import { Injectable } from '@angular/core';
import { BoardTask, BoardTaskList } from '../../../shared';

@Injectable({
  providedIn: 'root'
})
export abstract class TaskService {
  abstract createNewTask(task: BoardTask, allTaskLists: BoardTaskList[]): void;
  abstract updateTask(task: BoardTask, prevTaskList: BoardTaskList, currentTaskList: BoardTaskList, currentIndex: number): void;
  abstract deleteTask(task: BoardTask, currentTaskList: BoardTaskList): void;
}
