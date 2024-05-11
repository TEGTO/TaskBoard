import { InjectionToken } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { UserConfig } from './user-config';

export const USER_CONFIG = new InjectionToken<UserConfig>('userConfig');

export const APP_USER_CONFIG: UserConfig =
{
  userIdKey: environment.localStorageUser
}