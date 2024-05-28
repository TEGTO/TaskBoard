import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Board, DateFormaterService, RedirectorService } from '../../../../shared';
import { BoardManagerComponent, BoardService, ChangeBoardData } from '../../../index';

@Component({
  selector: 'board-item',
  templateUrl: './board-item.component.html',
  styleUrl: './board-item.component.scss'
})
export class BoardItemComponent implements OnInit {
  @Input({ required: true }) board: Board | undefined;
  @Input({ required: true }) allBoards: Board[] = [];

  taskListsAmount: number = 0;
  tasksAmount: number = 0;

  constructor(private dialog: MatDialog, private dateFormater: DateFormaterService, private redirector: RedirectorService, private boardService: BoardService) { }

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
        if (isNew)
          this.createNewBoard(result);
        else {
          this.board = result;
          this.updateBoard();
        }
      }
    });
  }
  redirectToBoard() {
    this.redirector.redirectToBoard(this.board?.id!);
  }
  deleteBoard() {
    this.boardService.deleteBoard(this.createBoardChangeData(this.board!));
  }
  private getBoardTaskListsAmount() {
    return this.boardService.getTaskListsAmountByBoardId(this.board?.id!).subscribe(amount => {
      this.taskListsAmount = amount;
    });
  }
  private getBoardTasksAmount() {
    return this.boardService.getTasksAmountByBoardId(this.board?.id!).subscribe(amount => {
      this.tasksAmount = amount;
    });
  }
  private createNewBoard(board: Board) {
    this.boardService.createBoard(this.createBoardChangeData(board));
  }
  private updateBoard() {
    this.boardService.updateBoard(this.createBoardChangeData(this.board!));
  }
  private createBoardChangeData(board: Board) {
    var data: ChangeBoardData = {
      board: board,
      allBoards: this.allBoards,
    }
    return data;
  }
}
