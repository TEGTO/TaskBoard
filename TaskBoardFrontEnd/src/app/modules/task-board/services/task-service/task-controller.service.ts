import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BoardTask, BoardTaskList } from '../../../shared';
import { createNewTask, deleteTask, updateTask } from '../../index';
import { TaskService } from './task-service';

@Injectable({
  providedIn: 'root'
})
export class TaskControllerService implements TaskService {

  constructor(private store: Store<{ taskListState: { taskLists: BoardTaskList[] } }>) {
  }

  createNewTask(task: BoardTask) {
    this.store.dispatch(createNewTask({ task }));
  }
  updateTask(prevTaskList: BoardTaskList, task: BoardTask, currentIndex: number) {
    this.store.dispatch(updateTask({ prevTaskList: prevTaskList, task: task, posIndex: currentIndex }));
  }
  deleteTask(task: BoardTask) {
    this.store.dispatch(deleteTask({ taskId: task.id }));
  }
}