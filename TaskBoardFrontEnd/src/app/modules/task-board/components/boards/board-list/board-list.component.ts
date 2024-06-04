import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from '../../../../shared';
import { BoardService } from '../../../index';

/**The component that shows all boards by user id. */
@Component({
  selector: 'board-list',
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.scss'
})
export class BoardListComponent implements OnInit {
  boards$!: Observable<Board[]>;

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
    this.boards$ = this.boardService.getBoardsByUserId();
  }
}