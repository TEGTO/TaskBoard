import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { BoardActivity } from '../../../models/board-activity.model';
import { UserApiService } from '../user-api/user-api.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityApiService {

  constructor(private httpClient: HttpClient, private userService: UserApiService) { }

  getBoardActivitiesOnPage(page: number, amountOnPage: number) {
    return this.userService.getUser().pipe(
      switchMap((user) => {
        if (!user)
          return new Observable<BoardActivity[]>(observer => observer.next([]));
        return this.httpClient.get<BoardActivity[]>(`/api/BoardActivity/userActivitiesOnPage/${user.id}?page=${page}&amountOnPage=${amountOnPage}`);
      })
    );
  }
  createActivity(acitvity: BoardActivity) {
    return this.httpClient.post<BoardActivity>(`/api/BoardActivity`, acitvity);
  }
  getBoardActivitiesAmount() {
    return this.userService.getUser().pipe(
      switchMap((user) => {
        if (!user)
          return new Observable<number>(observer => observer.next(0));
        return this.httpClient.get<number>(`/api/BoardActivity/userActivitiesOnPage/${user.id}/amount`);
      })
    );
  }
}
