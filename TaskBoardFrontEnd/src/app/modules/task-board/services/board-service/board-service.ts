import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from '../../../shared';

@Injectable({
  providedIn: 'root'
})
export abstract class BoardService {
  abstract getBoardsByUserId(): Observable<Board[]>;
  abstract getBoardById(id: string): Observable<Board | undefined>;
  abstract getTaskListsAmountByBoardId(id: string): Observable<number>;
  abstract getTasksAmountByBoardId(id: string): Observable<number>;
  abstract createBoard(board: Board): void;
  abstract updateBoard(board: Board): void;
  abstract deleteBoard(board: Board): void;
}
