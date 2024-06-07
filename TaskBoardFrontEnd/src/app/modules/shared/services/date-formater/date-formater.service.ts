
export abstract class DateFormaterService {
  abstract formatDate(date: Date | undefined): string | number;
}