import { BoardState } from "../../index";
import { selectAllBoards, selectBoardError, selectBoardState } from "./board.selector";

describe('Board Selectors', () => {
    const initialState: BoardState = {
        boards: [
            { id: "1", userId: "1", creationTime: new Date() },
            { id: "2", userId: "2", creationTime: new Date() },
        ],
        error: null
    };
    const errorState: BoardState = {
        boards: [],
        error: 'An error occurred'
    };

    it('should select the board state', () => {
        const result = selectBoardState.projector(initialState);
        expect(result).toEqual(initialState);
    });
    it('should select all boards', () => {
        const result = selectAllBoards.projector(initialState);
        expect(result).toEqual(initialState.boards);
    });
    it('should select board error', () => {
        const result = selectBoardError.projector(errorState);
        expect(result).toEqual(errorState.error);
    });
});