import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectorService {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  redirectToHome(): void {
    this.router.navigate(['']);
  }
  redirectToBoard(boardId: string): void {
    this.router.navigate([`/${boardId}`]);
  }
}
