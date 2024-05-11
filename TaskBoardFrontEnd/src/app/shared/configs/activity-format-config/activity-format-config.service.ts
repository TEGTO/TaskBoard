import { InjectionToken } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { ActivityFormatConfig } from './activity-format-config';

export const ACTIVITY_FORMAT_CONFIG = new InjectionToken<ActivityFormatConfig>('activityFormatConfig');

export const APP_ACTIVITY_FORMAT_CONFIG: ActivityFormatConfig =
{
  mainNameStyleBegin: environment.mainNameStyleBegin,
  mainNameStyleEnd: environment.mainNameStyleEnd,
  secondaryNameStyleBegin: environment.secondaryNameStyleBegin,
  secondaryNameStyleEnd: environment.secondaryNameStyleEnd,
  maxNameLength: environment.maxNameLength,
  maxNameLengthReplacingString: environment.maxNameLengthReplacingString
}