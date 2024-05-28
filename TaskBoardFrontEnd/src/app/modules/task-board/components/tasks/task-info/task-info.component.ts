import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ActivityService } from '../../../../action-history';
import { BoardTask, BoardTaskActivity, BoardTaskList, DateFormaterService, Priority, PriorityConvertorService } from '../../../../shared';
import { TaskManagerComponent, TaskPopupData } from '../../../index';

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrl: './task-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskInfoComponent {

  taskActivities$!: Observable<BoardTaskActivity[] | undefined>;
  task!: BoardTask;
  currentTaskList!: BoardTaskList;

  constructor(public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: TaskPopupData,
    private sanitizer: DomSanitizer,
    private activityService: ActivityService,
    private dateFormater: DateFormaterService,
    private cdr: ChangeDetectorRef) {
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
  updateView() {
    this.cdr.markForCheck();
  }
}