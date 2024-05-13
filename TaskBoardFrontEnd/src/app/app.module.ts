import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainViewComponent } from './core/components/main-view/main-view.component';
import { TaskBoardModule } from './modules/task-board/task-board.module';
import { ACTIVITY_FORMAT_CONFIG, APP_ACTIVITY_FORMAT_CONFIG } from './shared/configs/activity-format-config/activity-format-config.service';
import { APP_DATE_CONFIG, DATE_CONFIG } from './shared/configs/date-config/date-config.service';
import { APP_USER_CONFIG, USER_CONFIG } from './shared/configs/user-config/user-config.service';


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
