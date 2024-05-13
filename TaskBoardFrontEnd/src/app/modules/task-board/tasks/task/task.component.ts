import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DateFormaterService } from '../../../../shared/services/date-formater/date-formater.service';
import { PriorityConvertorService } from '../../services/priority-convertor/priority-convertor.service';
import { TaskService } from '../../services/task-service/task.service';
import { Priority } from '../../shared/enums/priority.enum';
import { BoardTaskList } from '../../shared/models/board-task-list.model';
import { BoardTask } from '../../shared/models/board-task.model';
import { TaskInfoComponent } from '../task-info/task-info.component';
import { TaskManagerComponent } from '../task-manager/task-manager.component';
import { TaskPopupData } from '../util/task-popup-data';

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
