import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DevModeService } from '../../../shared';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss'
})
export class MainViewComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private devMode: DevModeService) { }

  ngOnInit(): void {
    if (this.devMode.isDevMode())
      this.goToBoard("1");
  }
  goToBoard(boardId: string): void {
    this.router.navigate([boardId], { relativeTo: this.activatedRoute });
  }
}
