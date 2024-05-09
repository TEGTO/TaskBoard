import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainViewComponent } from './core/components/pages/main-view/main-view.component';
import { ACTIVITY_FORMAT_CONFIG, APP_ACTIVITY_FORMAT_CONFIG } from './shared/services/configs/activity-format-config/activity-format-config.service';
import { APP_DATE_CONFIG, DATE_CONFIG } from './shared/services/configs/date-config/date-config.service';
import { APP_USER_CONFIG, USER_CONFIG } from './shared/services/configs/user-config/user-config.service';
import { TaskBoardModule } from './task-board/task-board.module';


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
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
