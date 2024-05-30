import { createReducer, on } from "@ngrx/store";
import { Board } from "../../../shared";
import { createBoardFailure, createBoardSuccess, getBoardsByUserIdFailure, getBoardsByUserIdSuccess, removeBoardFailure, removeBoardSuccess, updateBoardFailure, updateBoardSuccess } from "../../index";

export interface BoardState {
    boards: Board[];
    error: any;
}
const initialState: BoardState = {
    boards: [],
    error: null
};

export const boardReducer = createReducer(
    initialState,
    on(getBoardsByUserIdSuccess, (state, { boards }) => ({
        ...state,
        boards,
        error: null
    })),
    on(getBoardsByUserIdFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(createBoardSuccess, (state, { board }) => ({
        ...state,
        boards: [...state.boards, board],
        error: null
    })),
    on(createBoardFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(updateBoardSuccess, (state, { board }) => ({
        ...state,
        boards: state.boards.map(b => b.id === board.id ? board : b),
        error: null
    })),
    on(updateBoardFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(removeBoardSuccess, (state, { boardId }) => ({
        ...state,
        boards: state.boards.filter(board => board.id !== boardId),
        error: null
    })),
    on(removeBoardFailure, (state, { error }) => ({
        ...state,
        error
    }))
);