import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Board } from '../../../../shared';
import { BoardService } from '../../../index';
import { BoardListComponent } from './board-list.component';

describe('BoardListComponent', () => {
  var component: BoardListComponent;
  var fixture: ComponentFixture<BoardListComponent>;
  var mockBoardService: jasmine.SpyObj<BoardService>;
  var debugElement: DebugElement;
  var mockBoards: Board[] = [{
    id: "1",
    userId: "",
    creationTime: new Date,
    name: "Board",
  }
  ];

  beforeEach(() => {
    mockBoardService = jasmine.createSpyObj<BoardService>('BoardService', ['getBoardsByUserId']);
    mockBoardService.getBoardsByUserId.and.returnValue(of(mockBoards));
    TestBed.configureTestingModule({
      declarations: [BoardListComponent],
      providers: [
        { provide: BoardService, useValue: mockBoardService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(BoardListComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should display list of boards when data is available', () => {
    fixture.detectChanges();

    const boardItems = debugElement.queryAll(By.css('board-item'));
    expect(boardItems.length).toBe(2);
  });
  it('should display board names', () => {
    fixture.detectChanges();

    const boardItems = debugElement.queryAll(By.css('board-item'));
    expect(boardItems.length).toEqual(2);
  });
});