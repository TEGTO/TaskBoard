import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BoardTask, BoardTaskList, DateFormaterService, Priority, PriorityConvertorService } from '../../../../shared';
import { TaskInfoComponent, TaskManagerComponent, TaskPopupData, TaskService } from '../../../index';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input({ required: true }) task: BoardTask | undefined;
  @Input({ required: true }) taskList!: BoardTaskList;
  @Input({ required: true }) allTaskLists!: BoardTaskList[];

  constructor(public dialog: MatDialog, private dateFormater: DateFormaterService,
    private taskService: TaskService) { }

  openInfoMenu() {
    const dialogRef = this.dialog.open(TaskInfoComponent, {
      data: this.getPopupData()
    });
  }
  openEditMenu() {
    const dialogRef = this.dialog.open(TaskManagerComponent, {
      data: this.getPopupData()
    });
  }
  deleteButton() {
    this.taskService.deleteTask(this.task!, this.taskList);
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
      currentTaskList: this.taskList,
      allTaskLists: this.allTaskLists
    }
    return taskPopupData;
  }
}
