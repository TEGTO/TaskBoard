import { Injectable } from '@angular/core';
import { Priority } from '../../enums/priority.enum';

@Injectable({
  providedIn: 'root'
})
export class PriorityConvertorService {

  static getAllPrioritiesString(): string[] {
    const priorityNames: string[] = [];
    priorityNames.push("Low");
    priorityNames.push("Medium");
    priorityNames.push("High");
    return priorityNames;
  }
  static getPriorityString(priority: Priority): string {
    switch (priority) {
      case Priority.Low:
        return 'Low';
      case Priority.Medium:
        return 'Medium';
      case Priority.High:
        return 'High';
      default:
        return '';
    }
  }
}
