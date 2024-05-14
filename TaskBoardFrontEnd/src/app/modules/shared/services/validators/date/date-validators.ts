import { ValidatorFn } from "@angular/forms";

export abstract class DateValidator {

    public abstract dateMinimum(minDate: Date): ValidatorFn;
}