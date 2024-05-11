import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivityHistoryComponent } from '../history/activity-history/activity-history.component';
import { TaskListApiService } from '../services/api/task-list-api/task-list-api.service';
import { BoardTaskList } from '../shared/models/board-task-list.model';

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
