import { Injectable } from '@angular/core';
import { ChangeTaskData } from '../../index';

@Injectable({
  providedIn: 'root'
})
export abstract class TaskService {
  abstract createNewTask(data: ChangeTaskData): void;
  abstract updateTask(data: ChangeTaskData, currentIndex: number): void;
  abstract deleteTask(data: ChangeTaskData): void;
}
