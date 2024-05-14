import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { APP_DATE_CONFIG, APP_USER_CONFIG, DATE_CONFIG, USER_CONFIG } from '../shared';
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
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class CoreModule { }
