import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Board, BoardApiService } from '../../../shared';
import { createBoard, deleteBoard, getBoardsByUserId, updateBoard } from '../../store/board/board.actions';
import { BoardControllerService } from './board-controller.service';

describe('BoardControllerService', () => {
  var mockBoardApiService: jasmine.SpyObj<BoardApiService>;
  var mockStore: jasmine.SpyObj<Store>;
  var service: BoardControllerService;

  beforeEach(() => {
    mockBoardApiService = jasmine.createSpyObj<BoardApiService>('BoardApiService', ['getBoardById', 'getTaskListsAmountByBoardId', 'getTasksAmountByBoardId']);
    mockStore = jasmine.createSpyObj<Store>('Store', ['dispatch', 'select']);

    TestBed.configureTestingModule({
      providers: [
        BoardControllerService,
        { provide: BoardApiService, useValue: mockBoardApiService },
        { provide: Store, useValue: mockStore },
      ]
    });
    service = TestBed.inject(BoardControllerService);
  });

  it('should dispatch getBoardsByUserId and return boards$', () => {
    const boardsMock = of([]);
    mockStore.select.and.returnValue(boardsMock);

    const result = service.getBoardsByUserId();
    expect(mockStore.dispatch).toHaveBeenCalledWith(getBoardsByUserId());
    result.subscribe(boards => {
      expect(boards).toEqual([]);
    });
  });
  it('should call getBoardById from BoardApiService', () => {
    const boardId = '123';
    const boardMock = { id: '123', userId: 'user1', creationTime: new Date() };
    mockBoardApiService.getBoardById.and.returnValue(of(boardMock));

    service.getBoardById(boardId).subscribe(board => {
      expect(board).toEqual(boardMock);
    });
    expect(mockBoardApiService.getBoardById).toHaveBeenCalledWith(boardId);
  });
  it('should call getTaskListsAmountByBoardId from BoardApiService', () => {
    const boardId = '123';
    const taskListsAmountMock = of(5);
    mockBoardApiService.getTaskListsAmountByBoardId.and.returnValue(taskListsAmountMock);

    service.getTaskListsAmountByBoardId(boardId).subscribe(amount => {
      expect(amount).toEqual(5);
    });
    expect(mockBoardApiService.getTaskListsAmountByBoardId).toHaveBeenCalledWith(boardId);
  });
  it('should call getTasksAmountByBoardId from BoardApiService', () => {
    const boardId = '123';
    const tasksAmountMock = of(10);
    mockBoardApiService.getTasksAmountByBoardId.and.returnValue(tasksAmountMock);

    service.getTasksAmountByBoardId(boardId).subscribe(amount => {
      expect(amount).toEqual(10);
    });
    expect(mockBoardApiService.getTasksAmountByBoardId).toHaveBeenCalledWith(boardId);
  });
  it('should dispatch createBoard', () => {
    const board: Board = { id: '123', userId: 'user1', creationTime: new Date() };

    service.createBoard(board);
    expect(mockStore.dispatch).toHaveBeenCalledWith(createBoard({ board }));
  });
  it('should dispatch updateBoard', () => {
    const board: Board = { id: '123', userId: 'user1', creationTime: new Date() };

    service.updateBoard(board);
    expect(mockStore.dispatch).toHaveBeenCalledWith(updateBoard({ board }));
  });
  it('should dispatch removeBoard', () => {
    const board: Board = { id: '123', userId: 'user1', creationTime: new Date() };

    service.deleteBoard(board);
    expect(mockStore.dispatch).toHaveBeenCalledWith(deleteBoard({ boardId: board.id }));
  });
});
