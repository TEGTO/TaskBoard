import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { BoardActivity, CustomErrorHandler, URLDefiner, UserApiService } from '../../../index';

@Injectable({
  providedIn: 'root'
})
export class ActivityApiService {

  constructor(private httpClient: HttpClient, private userService: UserApiService, private errorHandler: CustomErrorHandler, private urlDefiner: URLDefiner) { }

  getBoardActivitiesOnPage(page: number, amountOnPage: number) {
    return this.userService.getUser().pipe(
      switchMap((user) => {
        if (!user)
          return new Observable<BoardActivity[]>(observer => observer.next([]));
        return this.httpClient.get<BoardActivity[]>(this.urlDefiner.combineWithApiUrl(`/BoardActivity/userActivitiesOnPage/${user.id}?page=${page}&amountOnPage=${amountOnPage}`)).pipe(
          catchError((err) => this.handleError(err))
        );
      })
    );
  }
  createActivity(acitvity: BoardActivity) {
    return this.httpClient.post<BoardActivity>(this.urlDefiner.combineWithApiUrl(`/BoardActivity`), acitvity).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  getBoardActivitiesAmount() {
    return this.userService.getUser().pipe(
      switchMap((user) => {
        if (!user)
          return new Observable<number>(observer => observer.next(0));
        return this.httpClient.get<number>(this.urlDefiner.combineWithApiUrl(`/BoardActivity/userActivitiesOnPage/${user.id}/amount`)).pipe(
          catchError((err) => this.handleError(err))
        );
      })
    );
  }
  private handleError(error: Error) {
    this.errorHandler.handleError(error);
    return throwError(() => new Error(error.message));
  }
}
