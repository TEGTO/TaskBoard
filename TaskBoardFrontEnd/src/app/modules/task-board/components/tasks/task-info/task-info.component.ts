import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ActivityService } from '../../../../action-history';
import { BoardTask, BoardTaskActivity, BoardTaskList, DateFormaterService, Priority, PriorityConvertorService } from '../../../../shared';
import { TaskListService, TaskManagerComponent, TaskPopupData } from '../../../index';

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrl: './task-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskInfoComponent {
  task!: BoardTask;
  currentTaskList$!: Observable<BoardTaskList | undefined>;
  taskActivities$!: Observable<BoardTaskActivity[] | undefined>;

  constructor(public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: TaskPopupData,
    private taskListService: TaskListService,
    private sanitizer: DomSanitizer,
    private activityService: ActivityService,
    private dateFormater: DateFormaterService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.task = this.data.task!;
    this.currentTaskList$ = this.taskListService.getTaskListById(this.task.boardTaskListId!);
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