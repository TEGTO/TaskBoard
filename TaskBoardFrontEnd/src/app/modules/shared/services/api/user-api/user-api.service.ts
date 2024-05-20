import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, of, shareReplay, tap, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { CustomErrorHandler, LocalStorageService, URLDefiner, USER_CONFIG, User, UserConfig } from '../../../index';
import { DevModeService } from '../../dev-mode/dev-mode.service';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  user$: Observable<User | null> | undefined;
  user!: User | null;

  constructor(@Inject(USER_CONFIG) private userConfig: UserConfig, private errorHandler: CustomErrorHandler, private httpClient: HttpClient,
    private localStorageService: LocalStorageService, private devService: DevModeService, private urlDefiner: URLDefiner) {
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
        this.user$ = this.httpClient.get<User>(this.urlDefiner.combineWithApiUrl(`/User/${this.user!.id}`)).pipe(
          catchError((err) => {
            this.localStorageService.removeItem(this.userConfig.userIdKey);
            this.errorHandler.handleError(err);
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
    return this.httpClient.post<User>(this.urlDefiner.combineWithApiUrl(`/User`), { id: '' }).pipe(
      catchError((err) => {
        this.errorHandler.handleError(err);
        return throwError(() => new Error(err.message));
      })
    );
  }
}