import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DateValidator } from './date-validators';

@Injectable({
  providedIn: 'root'
})
export class CustomDatePickerValidatorService extends DateValidator {

  dateMinimum(minDate: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value instanceof Date && typeof control.value.getTime === 'function') {
        // Normalize both dates to midnight
        const selectedDate = new Date(control.value);
        selectedDate.setHours(0, 0, 0, 0);
        minDate.setHours(0, 0, 0, 0);
        return selectedDate >= minDate ? null : { 'dateMinimum': true };
      } else {
        return null;
      }
    };
  }
}