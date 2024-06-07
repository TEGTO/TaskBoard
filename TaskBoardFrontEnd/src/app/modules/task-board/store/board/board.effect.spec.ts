import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Observable, of, throwError } from "rxjs";
import { Board, BoardApiService } from "../../../shared";
import { createBoard, createBoardFailure, createBoardSuccess, deleteBoard, deleteBoardFailure, deleteBoardSuccess, getBoardsByUserId, getBoardsByUserIdFailure, getBoardsByUserIdSuccess, updateBoard, updateBoardFailure, updateBoardSuccess } from "./board.actions";
import { BoardEffects } from "./board.effect";


describe('BoardEffects', () => {
    var actions$: Observable<any>;
    var effects: BoardEffects;
    var mockBoardApiService: jasmine.SpyObj<BoardApiService>;

    const mockBoard: Board = { id: '1', userId: '1', creationTime: new Date() };
    const mockBoards: Board[] = [mockBoard];
    const mockError = { message: 'An error occurred' };

    beforeEach(() => {
        mockBoardApiService = jasmine.createSpyObj<BoardApiService>('BoardApiService', ['getBoardsByUserId', 'getBoardById', 'getTasksAmountByBoardId',
            'createBoard', 'updateBoard', 'deleteBoard']);
        mockBoardApiService.getBoardById.and.returnValue(of(mockBoard));

        TestBed.configureTestingModule({
            providers: [
                BoardEffects,
                provideMockActions(() => actions$),
                { provide: BoardApiService, useValue: mockBoardApiService }
            ]
        });

        effects = TestBed.inject(BoardEffects);
    });
    describe('loadBoards$', () => {
        it('should return a getBoardsByUserIdSuccess action, with boards, on success', (done) => {
            const action = getBoardsByUserId();
            const outcome = getBoardsByUserIdSuccess({ boards: mockBoards });

            actions$ = of(action);
            mockBoardApiService.getBoardsByUserId.and.returnValue(of(mockBoards));

            effects.loadBoards$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockBoardApiService.getBoardsByUserId).toHaveBeenCalled();
                done();
            });
        });
        it('should return a getBoardsByUserIdFailure action, with error, on failure', (done) => {
            const action = getBoardsByUserId();
            const outcome = getBoardsByUserIdFailure({ error: mockError });

            actions$ = of(action);
            mockBoardApiService.getBoardsByUserId.and.returnValue(throwError(mockError));

            effects.loadBoards$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockBoardApiService.getBoardsByUserId).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('createBoard$', () => {
        it('should return a createBoardSuccess action, with board, on success', (done) => {
            const action = createBoard({ board: mockBoard });
            const outcome = createBoardSuccess({ board: mockBoard });

            actions$ = of(action);
            mockBoardApiService.createBoard.and.returnValue(of(mockBoard));

            effects.createBoard$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockBoardApiService.createBoard).toHaveBeenCalledWith(mockBoard);
                done();
            });
        });
        it('should return a createBoardFailure action, with error, on failure', (done) => {
            const action = createBoard({ board: mockBoard });
            const outcome = createBoardFailure({ error: mockError });

            actions$ = of(action);
            mockBoardApiService.createBoard.and.returnValue(throwError(mockError));

            effects.createBoard$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockBoardApiService.createBoard).toHaveBeenCalledWith(mockBoard);
                done();
            });
        });
    });

    describe('updateBoard$', () => {
        it('should return a updateBoardSuccess action, with board, on success', (done) => {
            const action = updateBoard({ board: mockBoard });
            const outcome = updateBoardSuccess({ board: mockBoard });

            actions$ = of(action);
            mockBoardApiService.updateBoard.and.returnValue(of({}));

            effects.updateBoard$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockBoardApiService.updateBoard).toHaveBeenCalledWith(mockBoard);
                done();
            });
        });
        it('should return a updateBoardFailure action, with error, on failure', (done) => {
            const action = updateBoard({ board: mockBoard });
            const outcome = updateBoardFailure({ error: mockError });

            actions$ = of(action);
            mockBoardApiService.updateBoard.and.returnValue(throwError(mockError));

            effects.updateBoard$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockBoardApiService.updateBoard).toHaveBeenCalledWith(mockBoard);
                done();
            });
        });
    });

    describe('deleteBoard$', () => {
        it('should return a deleteTaskListSuccess action, with boardId, on success', (done) => {
            const action = deleteBoard({ boardId: '1' });
            const outcome = deleteBoardSuccess({ boardId: '1' });

            actions$ = of(action);
            mockBoardApiService.deleteBoard.and.returnValue(of({}));

            effects.deleteBoard$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockBoardApiService.deleteBoard).toHaveBeenCalledWith('1');
                done();
            });
        });
        it('should return a deleteBoardFailure action, with error, on failure', (done) => {
            const action = deleteBoard({ boardId: '1' });
            const outcome = deleteBoardFailure({ error: mockError });

            actions$ = of(action);
            mockBoardApiService.deleteBoard.and.returnValue(throwError(mockError));

            effects.deleteBoard$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockBoardApiService.deleteBoard).toHaveBeenCalledWith('1');
                done();
            });
        });
    });
}); 