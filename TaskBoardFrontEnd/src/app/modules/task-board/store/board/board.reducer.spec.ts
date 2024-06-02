import { Board } from "../../../shared";
import { createBoardFailure, createBoardSuccess, deleteBoardFailure, deleteBoardSuccess, getBoardsByUserIdFailure, getBoardsByUserIdSuccess, updateBoardFailure, updateBoardSuccess } from "../../index";
import { BoardState, boardReducer } from "./board.reducer";

describe('Board Reducer', () => {
    const initialState: BoardState = {
        boards: [],
        error: null
    };

    const mockBoards: Board[] = [
        { id: '1', userId: 'user1', creationTime: new Date(), name: 'Board 1' },
        { id: '2', userId: 'user2', creationTime: new Date(), name: 'Board 2' }
    ];

    it('should return the initial state', () => {
        const action = { type: 'Unknown' } as any;
        const state = boardReducer(initialState, action);
        expect(state).toBe(initialState);
    });

    it('should handle getBoardsByUserIdSuccess', () => {
        const action = getBoardsByUserIdSuccess({ boards: mockBoards });
        const state = boardReducer(initialState, action);
        expect(state.boards).toEqual(mockBoards);
        expect(state.error).toBeNull();
    });
    it('should handle getBoardsByUserIdSuccess with an empty array', () => {
        const action = getBoardsByUserIdSuccess({ boards: [] });
        const state = boardReducer(initialState, action);
        expect(state.boards).toEqual([]);
        expect(state.error).toBeNull();
    });
    it('should handle getBoardsByUserIdFailure', () => {
        const error = 'Error';
        const action = getBoardsByUserIdFailure({ error });
        const state = boardReducer(initialState, action);
        expect(state.error).toEqual(error);
    });

    it('should handle createBoardSuccess', () => {
        const newBoard: Board = { id: '3', userId: 'user3', creationTime: new Date(), name: 'Board 3' };
        const action = createBoardSuccess({ board: newBoard });
        const state = boardReducer(initialState, action);
        expect(state.boards).toEqual([newBoard]);
        expect(state.error).toBeNull();
    });
    it('should handle createBoardFailure', () => {
        const error = 'Error';
        const action = createBoardFailure({ error });
        const state = boardReducer(initialState, action);
        expect(state.error).toEqual(error);
    });

    it('should handle updateBoardSuccess', () => {
        const updatedBoard: Board = { id: '1', userId: 'user1', creationTime: new Date(), name: 'Updated Board 1' };
        const action = updateBoardSuccess({ board: updatedBoard });
        const state = boardReducer({ ...initialState, boards: mockBoards }, action);
        expect(state.boards).toEqual([updatedBoard, mockBoards[1]]);
        expect(state.error).toBeNull();
    });
    it('should handle updateBoardFailure', () => {
        const error = 'Error';
        const action = updateBoardFailure({ error });
        const state = boardReducer(initialState, action);
        expect(state.error).toEqual(error);
    });

    it('should handle deleteBoardSuccess', () => {
        const boardId = '1';
        const action = deleteBoardSuccess({ boardId });
        const state = boardReducer({ ...initialState, boards: mockBoards }, action);
        expect(state.boards).toEqual([mockBoards[1]]);
        expect(state.error).toBeNull();
    });
    it('should handle deleteBoardFailure', () => {
        const error = 'Error';
        const action = deleteBoardFailure({ error });
        const state = boardReducer(initialState, action);
        expect(state.error).toEqual(error);
    });
});