import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, of, shareReplay, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { BaseApiService, CustomErrorHandler, DevModeService, LocalStorageService, URLDefiner, USER_CONFIG, User, UserConfig } from '../../../index';

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends BaseApiService {
  user$: Observable<User | null> | undefined;
  user!: User | null;

  constructor(httpClient: HttpClient, errorHandler: CustomErrorHandler, urlDefiner: URLDefiner,
    @Inject(USER_CONFIG) private userConfig: UserConfig, private localStorageService: LocalStorageService, private devService: DevModeService) {
    super(httpClient, errorHandler, urlDefiner);
  }

  getUser(): Observable<User | null> {
    if (!this.user$) {
      this.user = this.devService.isDevMode() ? this.getDevUser() : this.getSavedUser();
      if (!this.user) {
        this.user$ = this.createUser().pipe(
          tap(user => {
            this.user = user;
            this.localStorageService.setItem(this.userConfig.userIdKey, this.user.id!);
          }),
          shareReplay(1)
        );
      }
      else {
        this.user$ = this.getHttpClient().get<User>(this.combinePathWithApiUrl(`/User/${this.user!.id}`)).pipe(
          catchError((err) => {
            this.localStorageService.removeItem(this.userConfig.userIdKey);
            this.handleError(err);
            return of(null);
          })
        );
      }
    }
    return this.user$!;
  }
  private getSavedUser(): User | null {
    const userId = this.localStorageService.getItem(this.userConfig.userIdKey);
    if (!userId)
      return null;
    return { id: userId } as User;
  }
  private getDevUser() {
    return { id: "1" } as User;
  }
  private createUser() {
    return this.getHttpClient().post<User>(this.combinePathWithApiUrl(`/User`), { id: '' }).pipe(
      catchError((err) => {
        return this.handleError(err);
      })
    );
  }
}