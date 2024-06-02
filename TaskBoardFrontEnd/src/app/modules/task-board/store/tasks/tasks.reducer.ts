import { moveItemInArray } from "@angular/cdk/drag-drop";
import { createReducer, on } from "@ngrx/store";
import { BoardTask, BoardTaskList } from "../../../shared";
import { createTaskFailure, createTaskListFailure, createTaskListSuccess, createTaskSuccess, deleteTaskFailure, deleteTaskListFailure, deleteTaskListSuccess, deleteTaskSuccess, getTaskListsByBoardIdFailure, getTaskListsByBoardIdSuccess, updateTask, updateTaskFailure, updateTaskListFailure, updateTaskListSuccess } from "../../index";

export interface TaskListState {
    taskLists: BoardTaskList[];
    error: any;
}
const initialState: TaskListState = {
    taskLists: [],
    error: null
};

export const taskReducer = createReducer(
    initialState,
    on(getTaskListsByBoardIdSuccess, (state, { taskLists }) => ({
        ...state,
        taskLists,
        error: null
    })),
    on(getTaskListsByBoardIdFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(createTaskListSuccess, (state, { taskList }) => ({
        ...state,
        taskLists: [...state.taskLists, taskList],
        error: null
    })),
    on(createTaskListFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(updateTaskListSuccess, (state, { taskList }) => ({
        ...state,
        taskLists: state.taskLists.map(list => list.id === taskList.id ? taskList : list),
        error: null
    })),
    on(updateTaskListFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(deleteTaskListSuccess, (state, { listId }) => ({
        ...state,
        taskLists: state.taskLists.filter(taskList => taskList.id !== listId),
        error: null
    })),
    on(deleteTaskListFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(createTaskSuccess, (state, { task }) => {
        const taskListIndex = state.taskLists.findIndex(list => list.id === task.boardTaskListId);
        if (taskListIndex >= 0) {
            const updatedTaskList = {
                ...state.taskLists[taskListIndex],
                boardTasks: [...state.taskLists[taskListIndex].boardTasks, task]
            };
            const updatedTaskLists = [...state.taskLists];
            updatedTaskLists[taskListIndex] = updatedTaskList;
            return {
                ...state,
                taskLists: updatedTaskLists,
                error: null
            };
        }
        return state;
    }),
    on(createTaskFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(updateTask, (state, { prevTaskList, task, posIndex }) => {
        const taskListIndex = state.taskLists.findIndex(list => list.id === task.boardTaskListId);
        if (taskListIndex === -1) {
            return state;
        }
        const currentTaskList = state.taskLists[taskListIndex];
        if (currentTaskList.id === prevTaskList.id) {
            return updateTaskInSameList(task, state, posIndex);
        } else {
            return updateTaskInDifferentList(task, state, posIndex, prevTaskList);
        }
    }),
    on(updateTaskFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(deleteTaskSuccess, (state, { taskId }) => {
        const taskListIndex = state.taskLists.findIndex(list => list.boardTasks.some(task => task.id === taskId));
        if (taskListIndex >= 0) {
            const updatedTaskList = {
                ...state.taskLists[taskListIndex],
                boardTasks: state.taskLists[taskListIndex].boardTasks.filter(task => task.id !== taskId)
            };
            const updatedTaskLists = [...state.taskLists];
            updatedTaskLists[taskListIndex] = updatedTaskList;
            return {
                ...state,
                taskLists: updatedTaskLists,
                error: null
            };
        }
        return state;
    }),
    on(deleteTaskFailure, (state, { error }) => ({
        ...state,
        error
    }))
);
function updateTaskInSameList(task: BoardTask, state: TaskListState, posIndex: number) {
    const taskListIndex = state.taskLists.findIndex(list => list.id === task.boardTaskListId);
    const currentTaskList = state.taskLists[taskListIndex];
    const taskIndex = currentTaskList.boardTasks.findIndex(t => t.id === task.id);

    if (taskIndex !== -1) {
        const updatedTasks = [...currentTaskList.boardTasks];
        updatedTasks.splice(posIndex, 1, task);
        moveItemInArray(updatedTasks, taskIndex, posIndex);
        const updatedTaskList = {
            ...currentTaskList,
            boardTasks: updatedTasks
        };
        const updatedTaskLists = [...state.taskLists];
        updatedTaskLists[taskListIndex] = updatedTaskList;
        return {
            ...state,
            taskLists: updatedTaskLists,
            error: null
        };
    }
    return state;
}
function updateTaskInDifferentList(task: BoardTask, state: TaskListState, posIndex: number, prevTaskList: BoardTaskList) {
    const taskListIndex = state.taskLists.findIndex(list => list.id === task.boardTaskListId);
    const prevTaskListIndex = state.taskLists.findIndex(list => list.id === prevTaskList.id);
    const currentTaskList = state.taskLists[taskListIndex];
    const prevTaskIndex = prevTaskList.boardTasks.findIndex(t => t.id === task.id);

    if (prevTaskIndex !== -1) {
        const updatedPrevTasks = [...prevTaskList.boardTasks];
        const updatedCurrentTasks = [...currentTaskList.boardTasks];
        updatedPrevTasks.splice(prevTaskIndex, 1);
        updatedCurrentTasks.splice(posIndex, 0, task);
        const updatedPrevTaskList = {
            ...prevTaskList,
            boardTasks: updatedPrevTasks
        };
        const updatedCurrentTaskList = {
            ...currentTaskList,
            boardTasks: updatedCurrentTasks
        };
        const updatedTaskLists = [...state.taskLists];
        updatedTaskLists[prevTaskListIndex] = updatedPrevTaskList;
        updatedTaskLists[taskListIndex] = updatedCurrentTaskList;
        return {
            ...state,
            taskLists: updatedTaskLists,
            error: null
        };
    }
    return state;
}