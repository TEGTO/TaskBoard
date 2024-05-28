import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivityHistoryComponent } from '../../../../action-history';
import { Board, BoardTaskList, RedirectorService, TaskListApiService } from '../../../../shared';
import { BoardService } from '../../../services/board-service/board-service';

@Component({
  selector: 'task-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
  boardId!: string;
  board$!: Observable<Board | undefined>;
  boards$!: Observable<Board[] | undefined>;
  taskLists$!: Observable<BoardTaskList[]>;

  constructor(private activatedRoute: ActivatedRoute, public dialog: MatDialog, private boardService: BoardService,
    private taskListService: TaskListApiService, private redirector: RedirectorService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.boardId = params['boardId'];
      this.boards$ = this.boardService.getBoardsByUserId();
      this.board$ = this.boardService.getBoardById(this.boardId);
      this.taskLists$ = this.taskListService.getTaskListsByBoardId(this.boardId);
    });
  }
  openHistoryBar() {
    this.board$.subscribe((board) => {
      if (board) {
        const dialogRef = this.dialog.open(ActivityHistoryComponent, {
          data: {
            board: board
          }
        });
      }
    })
  }
  changeBoard() {
    this.redirector.redirectToBoard(this.boardId);
  }
}