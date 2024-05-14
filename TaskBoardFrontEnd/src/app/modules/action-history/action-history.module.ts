import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ACTIVITY_FORMAT_CONFIG, APP_ACTIVITY_FORMAT_CONFIG, ActivityComponent, ActivityControllerService, ActivityDescriptionFormatterService, ActivityDescriptionManagerService, ActivityHistoryComponent, ActivityService } from './index';

@NgModule({
  declarations: [
    ActivityComponent,
    ActivityHistoryComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  exports:
    [
      ActivityHistoryComponent
    ],
  providers:
    [
      { provide: ACTIVITY_FORMAT_CONFIG, useValue: APP_ACTIVITY_FORMAT_CONFIG },
      { provide: ActivityService, useClass: ActivityControllerService },
      { provide: ActivityDescriptionFormatterService, useClass: ActivityDescriptionManagerService },
    ]
})
export class ActionHistoryModule { }
