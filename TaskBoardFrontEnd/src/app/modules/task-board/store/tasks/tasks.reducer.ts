import { createReducer, on } from "@ngrx/store";
import { BoardTaskList } from "../../../shared";
import { createNewTaskFailure, createNewTaskSuccess, createTaskListFailure, createTaskListSuccess, deleteTaskFailure, deleteTaskSuccess, getTaskListsByBoardIdFailure, getTaskListsByBoardIdSuccess, removeTaskListFailure, removeTaskListSuccess, updateTaskFailure, updateTaskListFailure, updateTaskListSuccess, updateTaskSuccess } from "../../index";

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
    on(removeTaskListSuccess, (state, { listId }) => ({
        ...state,
        taskLists: state.taskLists.filter(taskList => taskList.id !== listId),
        error: null
    })),
    on(removeTaskListFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(createNewTaskSuccess, (state, { task }) => {
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
    on(createNewTaskFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(updateTaskSuccess, (state, { task }) => {
        const taskListIndex = state.taskLists.findIndex(list => list.id === task.boardTaskListId);
        if (taskListIndex >= 0) {
            const taskIndex = state.taskLists[taskListIndex].boardTasks.findIndex(t => t.id === task.id);
            if (taskIndex >= 0) {
                const updatedTaskList = {
                    ...state.taskLists[taskListIndex],
                    boardTasks: [
                        ...state.taskLists[taskListIndex].boardTasks.slice(0, taskIndex),
                        task,
                        ...state.taskLists[taskListIndex].boardTasks.slice(taskIndex + 1)
                    ]
                };
                const updatedTaskLists = [...state.taskLists];
                updatedTaskLists[taskListIndex] = updatedTaskList;
                return {
                    ...state,
                    taskLists: updatedTaskLists,
                    error: null
                };
            }
        }
        return state;
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