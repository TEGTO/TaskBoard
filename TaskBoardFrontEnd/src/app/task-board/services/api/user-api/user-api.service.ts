import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../../../../shared/models/user.model';
import { UserConfig } from '../../../../shared/services/configs/user-config/user-config';
import { USER_CONFIG } from '../../../../shared/services/configs/user-config/user-config.service';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  user$: Observable<User> | undefined;
  userId!: string | null;

  constructor(@Inject(USER_CONFIG) private userConfig: UserConfig, private httpClient: HttpClient, private localStorageService: LocalStorageService) {
    this.getUserId();
  }

  getUser() {
    if (!this.user$)
      this.user$ = this.httpClient.get<User>(`/api/User/${this.userId}`);
    return this.user$;
  }
  private getUserId() {
    this.userId = this.localStorageService.getItem(this.userConfig.userIdKey);
    if (!this.userId) {
      this.httpClient.post<User>(`/api/User`, { id: "" }).subscribe(res => {
        this.userId = res.id;
        this.localStorageService.setItem(this.userConfig.userIdKey, this.userId!);
      });
    }
  }
}
