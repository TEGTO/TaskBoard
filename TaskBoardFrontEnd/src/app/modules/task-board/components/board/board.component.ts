import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ActivityHistoryComponent } from '../../../action-history';
import { BoardApiService, BoardTaskList, TaskListApiService } from '../../../shared';

@Component({
  selector: 'task-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
  boardId!: string;
  taskLists: BoardTaskList[] = [];

  constructor(private activatedRoute: ActivatedRoute, public dialog: MatDialog, private boardService: BoardApiService, private taskListService: TaskListApiService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.boardId = params['boardId'];
      this.getTaskLists();
    });
  }
  getTaskLists() {
    this.taskListService.getTaskListsByBoardId(this.boardId).subscribe(lists => {
      if (lists)
        this.taskLists = lists;
    });
  }
  openHistoryBar() {
    this.boardService.getBoardById(this.boardId).subscribe((board) => {
      if (board) {
        const dialogRef = this.dialog.open(ActivityHistoryComponent, {
          data: {
            board: board
          }
        });
      }
    })
  }
}