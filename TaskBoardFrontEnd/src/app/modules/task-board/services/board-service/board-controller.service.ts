import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Board, BoardApiService } from '../../../shared';
import { createBoard, getBoardsByUserId, removeBoard, selectAllBoards, updateBoard } from '../../index';
import { BoardService } from './board-service';

@Injectable({
  providedIn: 'root'
})
export class BoardControllerService implements BoardService {

  constructor(private boardApi: BoardApiService, private store: Store<{ boardState: { boards: Board[] } }>) { }

  getBoardsByUserId() {
    this.store.dispatch(getBoardsByUserId());
    var boards$ = this.store.select(selectAllBoards);
    return boards$;
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
  createBoard(board: Board) {
    this.store.dispatch(createBoard({ board }));
  }
  updateBoard(board: Board) {
    this.store.dispatch(updateBoard({ board }));
  }
  deleteBoard(board: Board) {
    this.store.dispatch(removeBoard({ boardId: board.id }));
  }
}
