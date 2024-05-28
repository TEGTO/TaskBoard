import { Injectable } from '@angular/core';
import { BoardApiService, copyBoardValues } from '../../../shared';
import { ChangeBoardData } from '../../index';
import { BoardService } from './board-service';

@Injectable({
  providedIn: 'root'
})
export class BoardControllerService implements BoardService {

  constructor(private boardApi: BoardApiService) { }

  getBoardsByUserId() {
    return this.boardApi.getBoardsByUserId();
  }
  getBoardById(id: string) {
    return this.boardApi.getBoardById(id);
  }
  getTaskListsAmountByBoardId(id: string) {
    return this.boardApi.getTaskListsAmountByBoardId(id);
  }
  getTasksAmountByBoardId(id: string) {
    return this.boardApi.getTasksAmountByBoardId(id);
  }
  createBoard(data: ChangeBoardData) {
    this.boardApi.createBoard(data.board).subscribe(res => {
      copyBoardValues(data.board, res);
      data.allBoards.push(data.board);
    });
  }
  updateBoard(data: ChangeBoardData) {
    this.getBoardById(data.board.id).subscribe(boardInApi => {
      if (boardInApi) {
        this.boardApi.updateBoard(data.board).subscribe();
      }
    });
  }
  deleteBoard(data: ChangeBoardData) {
    if (data.board.id) {
      this.boardApi.deleteBoard(data.board.id).subscribe(() => {
        this.deleteBoardFromArray(data);
      });
    }
  }
  private deleteBoardFromArray(data: ChangeBoardData) {
    const index: number = data.allBoards.indexOf(data.board);
    if (index !== -1)
      data.allBoards.splice(index, 1);
  }
}
