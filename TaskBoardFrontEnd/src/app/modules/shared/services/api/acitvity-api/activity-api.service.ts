import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { BoardActivity } from '../../../index';
import { BaseApiService } from '../base-api/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityApiService extends BaseApiService {

  getBoardActivitiesAmountByBoardId(id: string) {
    return this.getHttpClient().get<number>(this.combinePathWithApiUrl(`/BoardActivity/board/${id}/amount`)).pipe(
      catchError((err) => this.handleError(err)));
  }
  getBoardActivitiesOnPageByBoardId(id: string, page: number, amountOnPage: number) {
    return this.getHttpClient().get<BoardActivity[]>(this.combinePathWithApiUrl
      (`/BoardActivity/board/${id}/onpage?page=${page}&amountOnPage=${amountOnPage}`)).pipe(
        catchError((err) => this.handleError(err))
      );
  }
  createActivity(acitvity: BoardActivity) {
    return this.getHttpClient().post<BoardActivity>(this.combinePathWithApiUrl(`/BoardActivity`), acitvity).pipe(
      catchError((err) => this.handleError(err))
    );
  }
}