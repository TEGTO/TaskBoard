import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Board, DateFormaterService, RedirectorService } from '../../../../shared';
import { BoardManagerComponent, BoardService } from '../../../index';

@Component({
  selector: 'board-item',
  templateUrl: './board-item.component.html',
  styleUrl: './board-item.component.scss'
})
export class BoardItemComponent implements OnInit {
  @Input({ required: true }) board: Board | undefined;
  taskListsAmount: number = 0;
  tasksAmount: number = 0;

  constructor(private dialog: MatDialog,
    private dateFormater: DateFormaterService,
    private redirector: RedirectorService,
    private boardService: BoardService) { }

  ngOnInit(): void {
    this.getBoardTaskListsAmount();
    this.getBoardTasksAmount();
  }
  getFormatedDate(date: Date | undefined) {
    return this.dateFormater.formatDate(date);
  }
  openListManagerMenu() {
    const dialogRef = this.dialog.open(BoardManagerComponent, {
      data: this.board
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const isNew = this.board == undefined;
        if (isNew) {
          this.boardService.createBoard(result);
        }
        else {
          this.boardService.updateBoard(result);
        }
      }
    });
  }
  redirectToBoard() {
    this.redirector.redirectToBoard(this.board?.id!);
  }
  deleteBoard() {
    this.boardService.deleteBoard(this.board!);
  }
  private getBoardTaskListsAmount() {
    this.boardService.getTaskListsAmountByBoardId(this.board?.id!).subscribe(amount => {
      this.taskListsAmount = amount;
    });
  }
  private getBoardTasksAmount() {
    this.boardService.getTasksAmountByBoardId(this.board?.id!).subscribe(amount => {
      this.tasksAmount = amount;
    });
  }
}