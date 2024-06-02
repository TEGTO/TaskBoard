import { createAction, props } from "@ngrx/store";
import { Board } from "../../../shared";

export const getBoardsByUserId = createAction(
    '[Board] Get Boards By User Id'
);
export const getBoardsByUserIdSuccess = createAction(
    '[Board] Get Boards By User Id Success',
    props<{ boards: Board[] }>()
);
export const getBoardsByUserIdFailure = createAction(
    '[Board] Get Boards By User Id Failure',
    props<{ error: any }>()
);

export const createBoard = createAction(
    '[Board] Add Board',
    props<{ board: Board }>()
);
export const createBoardSuccess = createAction(
    '[Board] Add Board Success',
    props<{ board: Board }>()
);
export const createBoardFailure = createAction(
    '[Board] Add Board Failure',
    props<{ error: any }>()
);

export const updateBoard = createAction(
    '[Board] Update Board',
    props<{ board: Board }>()
);
export const updateBoardSuccess = createAction(
    '[Board] Update Board Success',
    props<{ board: Board }>()
);
export const updateBoardFailure = createAction(
    '[Board] Update Board Failure',
    props<{ error: any }>()
);

export const deleteBoard = createAction(
    '[Board] Delete Board',
    props<{ boardId: string }>()
);
export const deleteBoardSuccess = createAction(
    '[Board] Delete Board Success',
    props<{ boardId: string }>()
);
export const deleteBoardFailure = createAction(
    '[Board] Delete Board Failure',
    props<{ error: any }>()
);