import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BoardActivity, DateFormaterService } from '../../../../shared';

/**Component that renders activity board data.*/
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityComponent {
  @Input({ required: true }) activity!: BoardActivity;

  constructor(private sanitizer: DomSanitizer, private dateFormater: DateFormaterService, private cdr: ChangeDetectorRef) { }

  getFormatedDate(date: Date | undefined) {
    return this.dateFormater.formatDate(date);
  }
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  updateView() {
    this.cdr.markForCheck();
  }
}
