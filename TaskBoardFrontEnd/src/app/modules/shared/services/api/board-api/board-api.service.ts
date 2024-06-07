import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap } from 'rxjs';
import { BaseApiService, Board, CustomErrorHandler, URLDefiner, UserApiService } from '../../../index';

@Injectable({
  providedIn: 'root'
})
export class BoardApiService extends BaseApiService {

  constructor(httpClient: HttpClient, errorHandler: CustomErrorHandler, urlDefiner: URLDefiner, private userApiService: UserApiService) {
    super(httpClient, errorHandler, urlDefiner);
  }

  getBoardsByUserId(): Observable<Board[]> {
    return this.userApiService.getUser().pipe(
      switchMap(user => {
        if (!user)
          return new Observable<Board[]>(observer => observer.next([]));
        return this.getHttpClient().get<Board[]>(this.combinePathWithApiUrl(`/Board/user/${user.id}`)).pipe(
          catchError((err) => this.handleError(err))
        );
      }));
  }
  getBoardById(id: string): Observable<Board | undefined> {
    return this.getHttpClient().get<Board>(this.combinePathWithApiUrl(`/Board/${id}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  getTaskListsAmountByBoardId(id: string): Observable<number> {
    return this.getHttpClient().get<number>(this.combinePathWithApiUrl(`/Board/amount/tasklists/${id}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  getTasksAmountByBoardId(id: string): Observable<number> {
    return this.getHttpClient().get<number>(this.combinePathWithApiUrl(`/Board/amount/tasks/${id}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  createBoard(board: Board): Observable<Board> {
    return this.userApiService.getUser().pipe(
      switchMap(user => {
        if (!user)
          return new Observable<Board>(observer => observer.next());
        board = { ...board, userId: user.id, creationTime: new Date() };
        return this.getHttpClient().post<Board>(this.combinePathWithApiUrl(`/Board`), board).pipe(
          catchError((err) => this.handleError(err)));
      }));
  }
  updateBoard(board: Board) {
    return this.getHttpClient().put(this.combinePathWithApiUrl(`/Board`), board).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  deleteBoard(id: string) {
    return this.getHttpClient().delete(this.combinePathWithApiUrl(`/Board/${id}`)).pipe(
      catchError((err) => this.handleError(err))
    );
  }
}
