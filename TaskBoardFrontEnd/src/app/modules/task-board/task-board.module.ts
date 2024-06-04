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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { ActionHistoryModule } from '../action-history/action-history.module';
import { BoardComponent, BoardEffects as BoardEffect, BoardItemComponent, BoardListComponent, BoardManagerComponent, TaskComponent, TaskInfoComponent, TaskListComponent, TaskListEffect, TaskListManagerComponent, TaskManagerComponent, boardReducer, taskReducer } from './index';
import { TaskEffect } from './store/tasks/task/task.effect';

@NgModule({
  declarations: [
    TaskComponent,
    TaskListComponent,
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
    MatNativeDateModule,
    MatDatepickerModule,
    HttpClientModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    ActionHistoryModule
  ],
  exports: [BoardComponent],
  providers: [
    provideStore(),
    provideState({ name: "tasks", reducer: taskReducer }),
    provideState({ name: "boards", reducer: boardReducer }),
    provideEffects(TaskEffect),
    provideEffects(TaskListEffect),
    provideEffects(BoardEffect),
    provideAnimationsAsync()
  ]
})
export class TaskBoardModule { }
