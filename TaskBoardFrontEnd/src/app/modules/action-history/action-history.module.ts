import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivityComponent, ActivityHistoryComponent } from './index';

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
    ]
})
export class ActionHistoryModule { }
