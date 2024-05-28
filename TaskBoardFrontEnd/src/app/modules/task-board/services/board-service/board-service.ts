import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from '../../../shared';
import { ChangeBoardData } from '../../index';

@Injectable({
  providedIn: 'root'
})
export abstract class BoardService {
  abstract getBoardsByUserId(): Observable<Board[]>;
  abstract getBoardById(id: string): Observable<Board | undefined>;
  abstract getTaskListsAmountByBoardId(id: string): Observable<number>;
  abstract getTasksAmountByBoardId(id: string): Observable<number>;
  abstract createBoard(data: ChangeBoardData): void;
  abstract updateBoard(data: ChangeBoardData): void;
  abstract deleteBoard(data: ChangeBoardData): void;
}
