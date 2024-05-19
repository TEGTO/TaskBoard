import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, isDevMode } from '@angular/core';
import { catchError, shareReplay, tap, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { CustomErrorHandler, LocalStorageService, URLDefiner, USER_CONFIG, User, UserConfig } from '../../../index';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  user$: Observable<User> | undefined;
  user!: User | null;

  constructor(@Inject(USER_CONFIG) private userConfig: UserConfig, private errorHandler: CustomErrorHandler, private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private urlDefiner: URLDefiner) {
  }

  getUser(): Observable<User> {
    if (!this.user$) {
      this.user = isDevMode() ? this.getDevUser() : this.getSavedUser();
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
            return this.handleError(err);
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
    return { id: this.localStorageService.getItem(this.userConfig.userIdKey) } as User;
  }
  private getDevUser() {
    return { id: "1" } as User;
  }
  private createUser() {
    return this.httpClient.post<User>(this.urlDefiner.combineWithApiUrl(`/User`), { id: '' }).pipe(
      catchError((err) => this.handleError(err))
    );
  }
  private handleError(error: Error) {
    this.errorHandler.handleError(error);
    return throwError(() => new Error(error.message));
  }
}