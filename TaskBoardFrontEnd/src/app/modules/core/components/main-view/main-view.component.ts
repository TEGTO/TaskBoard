import { Component } from '@angular/core';
import { RedirectorService } from '../../../shared';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss'
})
export class MainViewComponent {
  constructor(private redirector: RedirectorService) { }
  redirectToHome(): void {
    this.redirector.redirectToHome();
  }
}
