import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StoreModule } from '@ngrx/store';
import { ACTIVITY_FORMAT_CONFIG, APP_ACTIVITY_FORMAT_CONFIG, ActivityControllerService, ActivityDescriptionFormatterService, ActivityDescriptionManagerService, ActivityService } from '../action-history';
import { APP_DATE_CONFIG, APP_USER_CONFIG, CustomDatePickerValidatorService, CustomErrorHandler, DATE_CONFIG, DateValidator, ErrorHandlerService, URLDefiner, URLDefinerService, USER_CONFIG } from '../shared';
import { BoardControllerService, BoardService, TaskControllerService, TaskListControllerService, TaskListService, TaskService } from '../task-board';
import { TaskBoardModule } from '../task-board/task-board.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { MainViewComponent } from './index';

@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TaskBoardModule,
    MatButtonModule,
    StoreModule.forRoot({}, {})
  ],
  providers: [
    { provide: DATE_CONFIG, useValue: APP_DATE_CONFIG },
    { provide: USER_CONFIG, useValue: APP_USER_CONFIG },
    { provide: ACTIVITY_FORMAT_CONFIG, useValue: APP_ACTIVITY_FORMAT_CONFIG },
    { provide: CustomErrorHandler, useClass: ErrorHandlerService },
    { provide: ActivityService, useClass: ActivityControllerService },
    { provide: ActivityDescriptionFormatterService, useClass: ActivityDescriptionManagerService },
    { provide: DateValidator, useClass: CustomDatePickerValidatorService },
    { provide: BoardService, useClass: BoardControllerService },
    { provide: TaskListService, useClass: TaskListControllerService },
    { provide: TaskService, useClass: TaskControllerService },
    { provide: URLDefiner, useClass: URLDefinerService },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class CoreModule { }
