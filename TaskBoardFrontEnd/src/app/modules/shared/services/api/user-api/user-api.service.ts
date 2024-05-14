import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, isDevMode } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { UserConfig } from '../../../configs/user-config/user-config';
import { USER_CONFIG } from '../../../configs/user-config/user-config.service';
import { User } from '../../../models/user.model';
import { LocalStorageService } from '../../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  user$: Observable<User | null> | undefined;
  userId!: string | null;

  constructor(@Inject(USER_CONFIG) private userConfig: UserConfig, private httpClient: HttpClient, private localStorageService: LocalStorageService) {
    this.getUserId();
  }

  getUser(): Observable<User | null> {
    if (!this.user$) {
      var userId = isDevMode() ? "1" : this.userId;
      this.user$ = this.httpClient.get<User>(`/api/User/${userId}`).pipe(
        catchError(() => of(null))
      );
    }
    return this.user$;
  }
  private getUserId() {
    this.userId = this.localStorageService.getItem(this.userConfig.userIdKey);
    if (!this.userId) {
      this.httpClient.post<User>(`/api/User`, { id: "" }).subscribe(res => {
        console.log(res);
        this.userId = res.id;
        this.localStorageService.setItem(this.userConfig.userIdKey, this.userId!);
      });
    }
  }
}
