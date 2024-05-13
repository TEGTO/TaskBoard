import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivityHistoryComponent } from '../../../../task-board/history/activity-history/activity-history.component';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss'
})
export class MainViewComponent {
  constructor(public dialog: MatDialog) { }

  openHistoryBar() {
    const dialogRef = this.dialog.open(ActivityHistoryComponent);
  }
}