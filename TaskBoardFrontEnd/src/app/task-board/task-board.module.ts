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
import { BoardComponent } from './board/board.component';
import { ActivityHistoryComponent } from './history/activity-history/activity-history.component';
import { ActivityComponent } from './history/activity/activity.component';
import { TaskInfoComponent } from './tasks/task-info/task-info.component';
import { TaskListManagerComponent } from './tasks/task-list-manager/task-list-manager.component';
import { TaskManagerComponent } from './tasks/task-manager/task-manager.component';
import { TaskComponent } from './tasks/task/task.component';
import { TasksListComponent } from './tasks/tasks-list/tasks-list.component';

@NgModule({
  declarations: [
    TaskComponent,
    TasksListComponent,
    ActivityHistoryComponent,
    ActivityComponent,
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
    ReactiveFormsModule
  ],
  exports: [BoardComponent]
})
export class TaskBoardModule { }
