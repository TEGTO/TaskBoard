import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Board, BoardApiService } from '../../../shared';
import { ChangeBoardData } from '../../index';
import { BoardControllerService } from './board-controller.service';

describe('BoardControllerService', () => {
  var service: BoardControllerService;
  var apiService: jasmine.SpyObj<BoardApiService>;

  beforeEach(() => {
    apiService = jasmine.createSpyObj('BoardApiService', ['getBoardsByUserId', 'getBoardById', 'getTaskListsAmountByBoardId',
      'getTasksAmountByBoardId', 'createBoard', 'updateBoard', 'deleteBoard'
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: BoardApiService, useValue: apiService },]
    });
    service = TestBed.inject(BoardControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get boards by user id ', () => {
    const board: Board = { id: '1', userId: "boardId", creationTime: new Date(), name: 'Board 1' }
    const board1: Board = { id: '2', userId: "boardId", creationTime: new Date(), name: 'Board 2' }
    const allBoards: Board[] = [board, board1];
    apiService.getBoardsByUserId.and.returnValue(of(allBoards));

    service.getBoardsByUserId().subscribe(
      (result) => {
        expect(result.length).toBe(2);
        expect(result[0]).toBe(board);
        expect(apiService.getBoardsByUserId).toHaveBeenCalled();
      }
    );
  });
  it('should get board by id', () => {
    const board: Board = { id: '1', userId: "boardId", creationTime: new Date(), name: 'Board 1' }
    const allBoards: Board[] = [board];
    apiService.getBoardById.and.callFake((id: string) => {
      const filteredBoard = allBoards.find(x => x.id === id);
      return of(filteredBoard);
    });

    service.getBoardById(board.id).subscribe(
      (result) => {
        expect(result).toBe(board);
        expect(apiService.getBoardById).toHaveBeenCalledWith(board.id);
      }
    );
  });
  it('should get task lists amount by board id', () => {
    const board: Board = { id: '1', userId: "boardId", creationTime: new Date(), name: 'Board 1' }
    const taskListsAmount = 10;
    apiService.getTaskListsAmountByBoardId.and.returnValue(of(taskListsAmount));

    service.getTaskListsAmountByBoardId(board.id).subscribe(
      (result) => {
        expect(result).toBe(taskListsAmount);
        expect(apiService.getTaskListsAmountByBoardId).toHaveBeenCalledWith(board.id);
      }
    );
  });
  it('should get tasks amount by board id', () => {
    const board: Board = { id: '1', userId: "boardId", creationTime: new Date(), name: 'Board 1' }
    const tasksAmount = 10;
    apiService.getTasksAmountByBoardId.and.returnValue(of(tasksAmount));

    service.getTasksAmountByBoardId(board.id).subscribe(
      (result) => {
        expect(result).toBe(tasksAmount);
        expect(apiService.getTasksAmountByBoardId).toHaveBeenCalledWith(board.id);
      }
    );
  });
  it('should create board', () => {
    const board: Board = { id: '1', userId: "1", creationTime: new Date(), name: 'board1' }
    const allBoards: Board[] = [];
    apiService.createBoard.and.returnValue(of(board));
    var data: ChangeBoardData = { board: board, allBoards: allBoards };

    service.createBoard(data);

    expect(allBoards.length).toBe(1);
    expect(allBoards[0]).toEqual(board);
    expect(apiService.createBoard).toHaveBeenCalledWith(board);
  });
  it('should update board', () => {
    const board: Board = { id: '1', userId: "boardId", creationTime: new Date(), name: 'Board 1' }
    const allBoards: Board[] = [board];
    apiService.getBoardById.and.returnValue(of(board));
    apiService.updateBoard.and.returnValue(of(board));
    var data: ChangeBoardData = { board: board, allBoards: allBoards };

    service.updateBoard(data);

    expect(apiService.getBoardById).toHaveBeenCalledWith(board.id);
    expect(apiService.updateBoard).toHaveBeenCalledWith(board);
  });
  it('should delete board', () => {
    const board: Board = { id: '1', userId: "boardId", creationTime: new Date(), name: 'Board 1' }
    const allBoards: Board[] = [board];
    apiService.deleteBoard.and.returnValue(of(board));
    var data: ChangeBoardData = { board: board, allBoards: allBoards };

    service.deleteBoard(data);

    expect(allBoards.length).toBe(0);
    expect(apiService.deleteBoard).toHaveBeenCalledWith(board.id);
  });
});
