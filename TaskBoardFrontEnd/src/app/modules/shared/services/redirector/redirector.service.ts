import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class RedirectorService {

  abstract redirectToHome(): void;
  abstract redirectToBoard(boardId: string): void;
}
