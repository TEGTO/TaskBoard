import { createAction, props } from "@ngrx/store";
import { BoardTask, BoardTaskList } from "../../../../shared";

export const createTask = createAction(
    '[Task] Create Task',
    props<{ task: BoardTask }>()
);
export const createTaskSuccess = createAction(
    '[Task] Create Task Success',
    props<{ task: BoardTask }>()
);
export const createTaskFailure = createAction(
    '[Task] Create Task Failure',
    props<{ error: any }>()
);

export const updateTask = createAction(
    '[Task] Update Task',
    props<{ prevTaskList: BoardTaskList, task: BoardTask; posIndex: number }>()
);
export const updateTaskSuccess = createAction(
    '[Task] Update Task Success',
    props<{ prevTaskList: BoardTaskList, task: BoardTask; posIndex: number }>()
);
export const updateTaskFailure = createAction(
    '[Task] Update Task Failure',
    props<{ error: any }>()
);

export const deleteTask = createAction(
    '[Task] Delete Task',
    props<{ taskId: string }>()
);
export const deleteTaskSuccess = createAction(
    '[Task] Delete Task Success',
    props<{ taskId: string }>()
);
export const deleteTaskFailure = createAction(
    '[Task] Delete Task Failure',
    props<{ error: any }>()
);