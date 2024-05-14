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
        const selectedDate = new Date(control.value);
        return selectedDate >= minDate ? null : { 'dateMinimum': true };
      } else {
        return null;
      }
    };
  }
}