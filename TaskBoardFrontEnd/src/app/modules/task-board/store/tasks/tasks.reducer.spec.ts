import { BoardTask, BoardTaskList, Priority } from "../../../shared";
import { createTaskFailure, createTaskListFailure, createTaskListSuccess, createTaskSuccess, deleteTaskFailure, deleteTaskListFailure, deleteTaskListSuccess, deleteTaskSuccess, getTaskListsByBoardIdFailure, getTaskListsByBoardIdSuccess, updateTask, updateTaskFailure, updateTaskListFailure, updateTaskListSuccess } from "../../index";
import { TaskListState, taskReducer } from "./tasks.reducer";

describe('Task Reducer', () => {

    var mockBoardTask: BoardTask;
    var mockTaskList: BoardTaskList;
    var mockTaskLists: BoardTaskList[];

    const initialState: TaskListState = {
        taskLists: [],
        error: null
    };

    beforeEach(() => {
        mockBoardTask = { id: "1", boardTaskListId: "1", creationTime: new Date(), priority: Priority.Low };
        mockTaskList = { id: "1", boardId: "1", creationTime: new Date(), name: 'Task List 1', boardTasks: [mockBoardTask] };
        mockTaskLists = [mockTaskList];
    });

    it('should return the initial state', () => {
        const action = { type: 'Unknown' };
        const state = taskReducer(initialState, action);
        expect(state).toBe(initialState);
    });

    it('should handle getTaskListsByBoardIdSuccess', () => {
        const action = getTaskListsByBoardIdSuccess({ taskLists: mockTaskLists });
        const state = taskReducer(initialState, action);
        expect(state.taskLists).toEqual(mockTaskLists);
        expect(state.error).toBeNull();
    });
    it('should handle getTaskListsByBoardIdFailure', () => {
        const error = 'Error';
        const action = getTaskListsByBoardIdFailure({ error });
        const state = taskReducer(initialState, action);
        expect(state.error).toEqual(error);
    });

    it('should handle createTaskListSuccess', () => {
        const action = createTaskListSuccess({ taskList: mockTaskList });
        const state = taskReducer(initialState, action);
        expect(state.taskLists).toEqual([mockTaskList]);
        expect(state.error).toBeNull();
    });
    it('should handle createTaskListFailure', () => {
        const error = 'Error';
        const action = createTaskListFailure({ error });
        const state = taskReducer(initialState, action);
        expect(state.error).toEqual(error);
    });

    it('should handle updateTaskListSuccess', () => {
        const initialStateWithTasks: TaskListState = {
            taskLists: mockTaskLists,
            error: null
        };
        const updatedTaskList = { id: "1", boardId: "2", creationTime: new Date(), name: 'New Name', boardTasks: [mockBoardTask] };
        const action = updateTaskListSuccess({ taskList: updatedTaskList });
        const state = taskReducer(initialStateWithTasks, action);
        expect(state.taskLists).toEqual([updatedTaskList]);
        expect(state.error).toBeNull();
    });
    it('should handle updateTaskListFailure', () => {
        const error = 'Error';
        const action = updateTaskListFailure({ error });
        const state = taskReducer(initialState, action);
        expect(state.error).toEqual(error);
    });

    it('should handle deleteTaskListSuccess', () => {
        const initialStateWithTasks: TaskListState = {
            taskLists: mockTaskLists,
            error: null
        };
        const listId = "1";
        const action = deleteTaskListSuccess({ listId });
        const state = taskReducer(initialStateWithTasks, action);
        expect(state.taskLists).toEqual([]);
        expect(state.error).toBeNull();
    });
    it('should handle deleteTaskListFailure', () => {
        const error = 'Error';
        const action = deleteTaskListFailure({ error });
        const state = taskReducer(initialState, action);
        expect(state.error).toEqual(error);
    });

    it('should handle createTaskSuccess', () => {
        const initialStateWithTaskLists: TaskListState = {
            taskLists: mockTaskLists,
            error: null
        };
        const newTask = { id: "2", boardTaskListId: "1", creationTime: new Date(), priority: Priority.Low };
        const action = createTaskSuccess({ task: newTask });
        const state = taskReducer(initialStateWithTaskLists, action);
        expect(state.taskLists[0].boardTasks[0]).toEqual(newTask);
        expect(state.error).toBeNull();
    });
    it('should handle createTaskFailure', () => {
        const error = 'Error';
        const action = createTaskFailure({ error });
        const state = taskReducer(initialState, action);
        expect(state.error).toEqual(error);
    });


    it('should update a task within the same list', () => {
        const task: BoardTask = { id: "1", boardTaskListId: "1", creationTime: new Date(), priority: Priority.Low }
        const listState: TaskListState = {
            taskLists:
                [
                    { id: "1", boardId: "1", creationTime: new Date(), name: 'Task List 2', boardTasks: [mockBoardTask, task] }
                ],
            error: null
        };
        const action = updateTask({ prevTaskList: listState.taskLists[0], task, posIndex: 0 });
        const state = taskReducer(listState, action);

        expect(state.taskLists[0].boardTasks[0]).toEqual(task);
    });
    it('should move a task to a different list', () => {
        const listState: TaskListState = {
            taskLists:
                [
                    mockTaskList,
                    { id: "2", boardId: "1", creationTime: new Date(), name: 'Task List 2', boardTasks: [mockBoardTask] }
                ],
            error: null
        };
        const task: BoardTask = { id: "1", boardTaskListId: "2", creationTime: new Date(), priority: Priority.Low }
        const action = updateTask({ prevTaskList: listState.taskLists[0], task, posIndex: 1 });
        const state = taskReducer(listState, action);

        expect(state.taskLists[0].boardTasks.length).toBe(0);
        expect(state.taskLists[1].boardTasks.length).toBe(2);
        expect(state.taskLists[1].boardTasks[1]).toEqual(task);
    });
    it('should not change the state if the task list is not found', () => {
        const listState: TaskListState = {
            taskLists:
                [
                    mockTaskList,
                    { id: "2", boardId: "1", creationTime: new Date(), name: 'Task List 2', boardTasks: [mockBoardTask] }
                ],
            error: null
        };
        const task: BoardTask = { id: "1", boardTaskListId: "3", creationTime: new Date(), priority: Priority.Low }
        const action = updateTask({ prevTaskList: listState.taskLists[0], task, posIndex: 0 });
        const state = taskReducer(listState, action);

        expect(state).toBe(listState);
    });
    it('should handle updateTaskFailure', () => {
        const error = 'Error';
        const action = updateTaskFailure({ error });
        const state = taskReducer(initialState, action);
        expect(state.error).toEqual(error);
    });

    it('should handle deleteTaskSuccess', () => {
        const initialStateWithTaskLists: TaskListState = {
            taskLists: mockTaskLists,
            error: null
        };
        const taskId = "1";
        const action = deleteTaskSuccess({ taskId });
        const state = taskReducer(initialStateWithTaskLists, action);
        expect(state.taskLists[0].boardTasks.length).toEqual(0);
        expect(state.error).toBeNull();
    });
    it('should handle deleteTaskFailure', () => {
        const error = 'Error';
        const action = deleteTaskFailure({ error });
        const state = taskReducer(initialState, action);
        expect(state.error).toEqual(error);
    });
});