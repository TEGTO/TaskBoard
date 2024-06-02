import { Board } from "../../../shared";
import { createBoard, createBoardFailure, createBoardSuccess, deleteBoard, deleteBoardFailure, deleteBoardSuccess, getBoardsByUserId, getBoardsByUserIdFailure, getBoardsByUserIdSuccess, updateBoard, updateBoardFailure, updateBoardSuccess } from "./board.actions";

describe('Board Actions', () => {
    const board: Board = { id: '1', userId: '1', creationTime: new Date() };
    const boards: Board[] = [board];

    const error = { message: 'An error occurred' };

    describe('Get Boards By User Id Actions', () => {
        it('should create getBoardsByUserId action', () => {
            const action = getBoardsByUserId();
            expect(action.type).toBe('[Board] Get Boards By User Id');
        });
        it('should create getBoardsByUserIdSuccess action', () => {
            const action = getBoardsByUserIdSuccess({ boards });
            expect(action.type).toBe('[Board] Get Boards By User Id Success');
            expect(action.boards).toEqual(boards);
        });
        it('should create getBoardsByUserIdFailure action', () => {
            const action = getBoardsByUserIdFailure({ error });
            expect(action.type).toBe('[Board] Get Boards By User Id Failure');
            expect(action.error).toEqual(error);
        });
    });

    describe('Add Board Actions', () => {
        it('should create createBoard action', () => {
            const action = createBoard({ board });
            expect(action.type).toBe('[Board] Add Board');
            expect(action.board).toEqual(board);
        });
        it('should create createBoardSuccess action', () => {
            const action = createBoardSuccess({ board });
            expect(action.type).toBe('[Board] Add Board Success');
            expect(action.board).toEqual(board);
        });
        it('should create createBoardFailure action', () => {
            const action = createBoardFailure({ error });
            expect(action.type).toBe('[Board] Add Board Failure');
            expect(action.error).toEqual(error);
        });
    });

    describe('Update Board Actions', () => {
        it('should create updateBoard action', () => {
            const action = updateBoard({ board });
            expect(action.type).toBe('[Board] Update Board');
            expect(action.board).toEqual(board);
        });
        it('should create updateBoardSuccess action', () => {
            const action = updateBoardSuccess({ board });
            expect(action.type).toBe('[Board] Update Board Success');
            expect(action.board).toEqual(board);
        });
        it('should create updateBoardFailure action', () => {
            const action = updateBoardFailure({ error });
            expect(action.type).toBe('[Board] Update Board Failure');
            expect(action.error).toEqual(error);
        });
    });

    describe('Delete Board Actions', () => {
        const boardId = '1';

        it('should create deleteBoard action', () => {
            const action = deleteBoard({ boardId: boardId });
            expect(action.type).toBe('[Board] Delete Board');
            expect(action.boardId).toBe(boardId);
        });
        it('should create deleteBoardSuccess action', () => {
            const action = deleteBoardSuccess({ boardId: boardId });
            expect(action.type).toBe('[Board] Delete Board Success');
            expect(action.boardId).toBe(boardId);
        });
        it('should create deleteBoardFailure action', () => {
            const action = deleteBoardFailure({ error });
            expect(action.type).toBe('[Board] Delete Board Failure');
            expect(action.error).toEqual(error);
        });
    });
});