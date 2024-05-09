import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustromValidatorsService {

  static dateMinimum(minDate: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      if (!selectedDate || isNaN(selectedDate.getTime())) {
        return null;
      }
      return selectedDate >= minDate || selectedDate.toDateString() === minDate.toDateString() ? null : { 'dateMinimum': true };
    };
  }
}
