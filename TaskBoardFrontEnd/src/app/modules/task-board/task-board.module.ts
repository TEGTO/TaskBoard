import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivityControllerService, ActivityService } from '../action-history';
import { ActionHistoryModule } from '../action-history/action-history.module';
import { CustomDatePickerValidatorService, DateValidator } from '../shared';
import { BoardComponent, TaskComponent, TaskControllerService, TaskInfoComponent, TaskListControllerService, TaskListManagerComponent, TaskListService, TaskManagerComponent, TaskService, TasksListComponent } from './index';

@NgModule({
  declarations: [
    TaskComponent,
    TasksListComponent,
    TaskListManagerComponent,
    TaskInfoComponent,
    TaskManagerComponent,
    BoardComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    ActionHistoryModule
  ],
  exports: [BoardComponent],
  providers: [
    { provide: DateValidator, useClass: CustomDatePickerValidatorService },
    { provide: TaskListService, useClass: TaskListControllerService },
    { provide: TaskService, useClass: TaskControllerService },
    { provide: ActivityService, useClass: ActivityControllerService },
  ],
})
export class TaskBoardModule { }
