import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringFormatService {
  static format(format: string, ...args: any[]): string {
    return format.replace(/{(\d+)}/g, (match, index) => {
      return typeof args[index] !== 'undefined' ? args[index] : match;
    });
  }
}
