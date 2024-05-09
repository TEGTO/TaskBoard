import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Priority } from '../../../shared/enums/priority.enum';
import { BoardTaskActivity } from '../../../shared/models/board-task-activity.model';
import { BoardTaskList } from '../../../shared/models/board-task-list.model';
import { BoardTask } from '../../../shared/models/board-task.model';
import { DateFormaterService } from '../../../shared/services/date-formater/date-formater.service';
import { PriorityConvertorService } from '../../../shared/services/priority-convertor/priority-convertor.service';
import { ActivityService } from '../../services/acitvity-service/activity.service';
import { TaskManagerComponent } from '../task-manager/task-manager.component';
import { TaskPopupData } from '../util/task-popup-data';

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrl: './task-info.component.scss'
})
export class TaskInfoComponent {

  taskActivities$!: Observable<BoardTaskActivity[] | undefined>;
  task!: BoardTask;
  currentTaskList!: BoardTaskList;

  constructor(public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: TaskPopupData,
    private sanitizer: DomSanitizer,
    private activityService: ActivityService,
    private dateFormater: DateFormaterService) {
  }

  ngOnInit(): void {
    this.task = this.data.task!;
    this.currentTaskList = this.data.currentTaskList!;
    this.taskActivities$ = this.activityService.getTaskActivitiesByTaskId(this.task.id);
  }
  openEditMenu() {
    const dialogRef = this.dialog.open(TaskManagerComponent, {
      data: this.data
    });
  }
  getPriorityString(priority: Priority): string {
    return PriorityConvertorService.getPriorityString(priority);
  }
  getFormatedDate(date: Date | undefined) {
    return this.dateFormater.formatDate(date);
  }
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
