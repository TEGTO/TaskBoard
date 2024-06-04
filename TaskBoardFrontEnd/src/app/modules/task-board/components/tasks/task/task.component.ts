import { Component, Injector, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BoardTask, DateFormaterService, Priority, PriorityConvertorService } from '../../../../shared';
import { TaskInfoComponent, TaskManagerComponent, TaskPopupData, TaskService } from '../../../index';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input({ required: true }) task!: BoardTask;
  @Input({ required: true }) boardId!: string;

  constructor(public dialog: MatDialog,
    private dateFormater: DateFormaterService,
    private taskService: TaskService,
    private injector: Injector) { }

  openInfoMenu() {
    const dialogRef = this.dialog.open(TaskInfoComponent, {
      data: this.getPopupData(),
      injector: this.injector
    });
  }
  openEditMenu() {
    const dialogRef = this.dialog.open(TaskManagerComponent, {
      data: this.getPopupData()
    });
  }
  deleteTask() {
    this.taskService.deleteTask(this.task);
  }
  getPriorityString(priority: Priority): string {
    return PriorityConvertorService.getPriorityString(priority);
  }
  getFormatedDate(date: Date | undefined) {
    return this.dateFormater.formatDate(date);
  }
  private getPopupData() {
    const taskPopupData: TaskPopupData = {
      task: this.task,
      taskListId: this.task.boardTaskListId,
      boardId: this.boardId
    }
    return taskPopupData;
  }
}
