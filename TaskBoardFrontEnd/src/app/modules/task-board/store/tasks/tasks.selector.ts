import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TaskListState } from "../../index";

export const selectTaskListState = createFeatureSelector<TaskListState>('tasks');

export const selectAllTaskLists = createSelector(
    selectTaskListState,
    (state: TaskListState) => state.taskLists
);
export const selectTaskError = createSelector(
    selectTaskListState,
    (state: TaskListState) => state.error
);

