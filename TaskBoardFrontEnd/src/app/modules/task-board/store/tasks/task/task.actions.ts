import { createAction, props } from "@ngrx/store";
import { BoardTask } from "../../../../shared";

export const createNewTask = createAction(
    '[Task] Create New Task',
    props<{ task: BoardTask }>()
);
export const createNewTaskSuccess = createAction(
    '[Task] Create New Task Success',
    props<{ task: BoardTask }>()
);
export const createNewTaskFailure = createAction(
    '[Task] Create New Task Failure',
    props<{ error: any }>()
);

export const updateTask = createAction(
    '[Task] Update Task',
    props<{ task: BoardTask; posIndex: number }>()
);
export const updateTaskSuccess = createAction(
    '[Task] Update Task Success',
    props<{ task: BoardTask }>()
);
export const updateTaskFailure = createAction(
    '[Task] Update Task Failure',
    props<{ error: any }>()
);

export const deleteTask = createAction(
    '[Task] Delete Task',
    props<{ task: BoardTask }>()
);
export const deleteTaskSuccess = createAction(
    '[Task] Delete Task Success',
    props<{ taskId: string }>()
);
export const deleteTaskFailure = createAction(
    '[Task] Delete Task Failure',
    props<{ error: any }>()
);