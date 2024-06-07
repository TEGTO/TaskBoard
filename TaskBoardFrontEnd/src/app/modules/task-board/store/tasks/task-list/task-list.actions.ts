import { createAction, props } from "@ngrx/store";
import { BoardTaskList } from "../../../../shared";

export const getTaskListsByBoardId = createAction(
    '[Task List] Get Task Lists By Board Id',
    props<{ boardId: string }>()
);
export const getTaskListsByBoardIdSuccess = createAction(
    '[Task List] Get Task Lists By Board Id Success',
    props<{ taskLists: BoardTaskList[] }>()
);
export const getTaskListsByBoardIdFailure = createAction(
    '[Task List] Get Task Lists By Board Id Failure',
    props<{ error: any }>()
);

export const createTaskList = createAction(
    '[Task List] Add Task List',
    props<{ taskList: BoardTaskList }>()
);
export const createTaskListSuccess = createAction(
    '[Task List] Add Task List Success',
    props<{ taskList: BoardTaskList }>()
);
export const createTaskListFailure = createAction(
    '[Task List] Add Task List Failure',
    props<{ error: any }>()
);

export const updateTaskList = createAction(
    '[Task List] Update Task List',
    props<{ taskList: BoardTaskList }>()
);
export const updateTaskListSuccess = createAction(
    '[Task List] Update Task List Success',
    props<{ taskList: BoardTaskList }>()
);
export const updateTaskListFailure = createAction(
    '[Task List] Update Task List Failure',
    props<{ error: any }>()
);

export const deleteTaskList = createAction(
    '[Task List] Delete Task List',
    props<{ listId: string }>()
);
export const deleteTaskListSuccess = createAction(
    '[Task List] Delete Task List Success',
    props<{ listId: string }>()
);
export const deleteTaskListFailure = createAction(
    '[Task List] Delete Task List Failure',
    props<{ error: any }>()
);