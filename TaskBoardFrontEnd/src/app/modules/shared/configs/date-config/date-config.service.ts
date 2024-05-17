import { InjectionToken } from '@angular/core';
import { environment } from '../../../../../environment/environment';
import { DateConfig } from './date-config';

export const DATE_CONFIG = new InjectionToken<DateConfig>('dateConfig');

export const APP_DATE_CONFIG: DateConfig =
{
  format: environment.dateFormat
}