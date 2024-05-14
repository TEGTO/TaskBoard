import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivityHistoryComponent } from '../../../action-history';
import { BoardTaskList, TaskListApiService } from '../../../shared';


@Component({
  selector: 'task-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {

  taskLists: BoardTaskList[] = [];

  constructor(public dialog: MatDialog, private taskListService: TaskListApiService) { }

  ngOnInit(): void {
    this.getTaskLists();
  }
  getTaskLists() {
    this.taskListService.getTaskLists().subscribe(lists => {
      if (lists)
        this.taskLists = lists;
    }
    );
  }
  openHistoryBar() {
    const dialogRef = this.dialog.open(ActivityHistoryComponent);
  }
}
