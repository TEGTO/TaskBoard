import { createAction, props } from "@ngrx/store";
import { BoardTaskList } from "../../../../shared";

export const getTaskListsByBoardId = createAction(
    '[Task] Get Task Lists By Board Id',
    props<{ boardId: string }>()
);
export const getTaskListsByBoardIdSuccess = createAction(
    '[Task] Get Task Lists By Board Id Success',
    props<{ taskLists: BoardTaskList[] }>()
);
export const getTaskListsByBoardIdFailure = createAction(
    '[Task] Get Task Lists By Board Id Failure',
    props<{ error: any }>()
);

export const createTaskList = createAction(
    '[Task] Add Task List',
    props<{ taskList: BoardTaskList }>()
);
export const createTaskListSuccess = createAction(
    '[Task] Add Task List Success',
    props<{ taskList: BoardTaskList }>()
);
export const createTaskListFailure = createAction(
    '[Task] Add Task List Failure',
    props<{ error: any }>()
);

export const updateTaskList = createAction(
    '[Task] Update Task List',
    props<{ taskList: BoardTaskList }>()
);
export const updateTaskListSuccess = createAction(
    '[Task] Update Task List Success',
    props<{ taskList: BoardTaskList }>()
);
export const updateTaskListFailure = createAction(
    '[Task] Update Task List Failure',
    props<{ error: any }>()
);

export const removeTaskList = createAction(
    '[Task] Remove Task List',
    props<{ listId: string }>()
);
export const removeTaskListSuccess = createAction(
    '[Task] Remove Task List Success',
    props<{ listId: string }>()
);
export const removeTaskListFailure = createAction(
    '[Task] Remove Task List Failure',
    props<{ error: any }>()
);