import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DateFormaterService } from '../../../../shared/services/date-formater/date-formater.service';
import { BoardActivity } from '../../shared/models/board-activity.model';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent {
  @Input({ required: true }) activity!: BoardActivity;

  constructor(private sanitizer: DomSanitizer, private dateFormater: DateFormaterService) { }

  getFormatedDate(date: Date | undefined) {
    return this.dateFormater.formatDate(date);
  }
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
