import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BoardTask, DateFormaterService, Priority, PriorityConvertorService } from '../../../../shared';
import { ChangeTaskData, TaskComponentData, TaskInfoComponent, TaskManagerComponent, TaskPopupData, TaskService } from '../../../index';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input({ required: true }) task!: BoardTask;
  @Input({ required: true }) componentData!: TaskComponentData;

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
    this.taskService.deleteTask(this.createChangeTaskData());
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
      currentTaskList: this.componentData.currentTaskList,
      allTaskLists: this.componentData.allTaskLists,
      board: this.componentData.board
    }
    return taskPopupData;
  }
  private createChangeTaskData() {
    var data: ChangeTaskData = {
      task: this.task,
      currentTaskList: this.componentData.currentTaskList,
      prevTaskList: this.componentData.currentTaskList,
      allTaskLists: this.componentData.allTaskLists,
      board: this.componentData.board
    }
    return data;
  }
}
