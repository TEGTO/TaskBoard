import { createAction, props } from "@ngrx/store";
import { Board } from "../../../shared";

export const getBoardsByUserId = createAction(
    '[Task] Get Boards By User Id'
);
export const getBoardsByUserIdSuccess = createAction(
    '[Task] Get Boards By User Id Success',
    props<{ boards: Board[] }>()
);
export const getBoardsByUserIdFailure = createAction(
    '[Task] Get Boards By User Id Failure',
    props<{ error: any }>()
);

export const createBoard = createAction(
    '[Task] Add Board',
    props<{ board: Board }>()
);
export const createBoardSuccess = createAction(
    '[Task] Add Board Success',
    props<{ board: Board }>()
);
export const createBoardFailure = createAction(
    '[Task] Add Board Failure',
    props<{ error: any }>()
);

export const updateBoard = createAction(
    '[Task] Update Board',
    props<{ board: Board }>()
);
export const updateBoardSuccess = createAction(
    '[Task] Update Board Success',
    props<{ board: Board }>()
);
export const updateBoardFailure = createAction(
    '[Task] Update Board Failure',
    props<{ error: any }>()
);

export const removeBoard = createAction(
    '[Task] Remove Board',
    props<{ boardId: string }>()
);
export const removeBoardSuccess = createAction(
    '[Task] Remove Board Success',
    props<{ boardId: string }>()
);
export const removeBoardFailure = createAction(
    '[Task] Remove Board Failure',
    props<{ error: any }>()
);