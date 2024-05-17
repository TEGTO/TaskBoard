import { FormControl, ValidatorFn } from '@angular/forms';
import { CustomDatePickerValidatorService } from './custrom-validators.service';

describe('CustomDataPickerValidatorService', () => {
  var service: CustomDatePickerValidatorService;
  var validatorFn: ValidatorFn;

  beforeEach(() => {
    const minDate = new Date(2024, 4, 13); // May 13, 2024
    service = new CustomDatePickerValidatorService();
    validatorFn = service.dateMinimum(minDate);
  });

  it('should return null when date is greater than or equal to minDate', () => {
    const control = new FormControl(new Date(2024, 4, 14)); // May 14, 2024
    const result = validatorFn(control);
    expect(result).toBeNull();
  });
  it('should return null when date is equal to minDate', () => {
    const control = new FormControl(new Date(2024, 4, 13)); // May 13, 2024
    const result = validatorFn(control);
    expect(result).toBeNull();
  });
  it('should return error when date is less than minDate', () => {
    const control = new FormControl(new Date(2024, 4, 12)); // May 12, 2024
    const result = validatorFn(control);
    expect(result).toEqual({ 'dateMinimum': true });
  });
  it('should return null when control value is null', () => {
    const control = new FormControl(null);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });
  it('should return null when control value is undefined', () => {
    const control = new FormControl(undefined);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });
  it('should return null when control value is invalid date string', () => {
    const control = new FormControl('invalid date');
    const result = validatorFn(control);
    expect(result).toBeNull();
  });
});