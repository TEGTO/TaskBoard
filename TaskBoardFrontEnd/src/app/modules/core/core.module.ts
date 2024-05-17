import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ACTIVITY_FORMAT_CONFIG, APP_ACTIVITY_FORMAT_CONFIG, ActivityControllerService, ActivityDescriptionFormatterService, ActivityDescriptionManagerService, ActivityService } from '../action-history';
import { APP_DATE_CONFIG, APP_USER_CONFIG, CustomDatePickerValidatorService, DATE_CONFIG, DateValidator, USER_CONFIG } from '../shared';
import { TaskControllerService, TaskListControllerService, TaskListService, TaskService } from '../task-board';
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
    TaskBoardModule
  ],
  providers: [
    { provide: DATE_CONFIG, useValue: APP_DATE_CONFIG },
    { provide: USER_CONFIG, useValue: APP_USER_CONFIG },
    { provide: ACTIVITY_FORMAT_CONFIG, useValue: APP_ACTIVITY_FORMAT_CONFIG },
    { provide: ActivityService, useClass: ActivityControllerService },
    { provide: ActivityDescriptionFormatterService, useClass: ActivityDescriptionManagerService },
    { provide: DateValidator, useClass: CustomDatePickerValidatorService },
    { provide: TaskListService, useClass: TaskListControllerService },
    { provide: TaskService, useClass: TaskControllerService },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class CoreModule { }
