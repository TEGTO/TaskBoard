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
import { ActionHistoryModule } from '../action-history/action-history.module';
import { BoardComponent, BoardListComponent, TaskComponent, TaskInfoComponent, TaskListManagerComponent, TaskManagerComponent, TasksListComponent } from './index';
import { BoardItemComponent } from './components/boards/board-item/board-item.component';
import { BoardManagerComponent } from './components/boards/board-manager/board-manager.component';

@NgModule({
  declarations: [
    TaskComponent,
    TasksListComponent,
    TaskListManagerComponent,
    TaskInfoComponent,
    TaskManagerComponent,
    BoardComponent,
    BoardListComponent,
    BoardItemComponent,
    BoardManagerComponent
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
})
export class TaskBoardModule { }
