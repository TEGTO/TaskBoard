import { createFeatureSelector, createSelector } from "@ngrx/store";
import { BoardState } from "../../index";

export const selectBoardState = createFeatureSelector<BoardState>('boards');

export const selectAllBoards = createSelector(
    selectBoardState,
    (state: BoardState) => state.boards
);
export const selectBoardError = createSelector(
    selectBoardState,
    (state: BoardState) => state.error
);

