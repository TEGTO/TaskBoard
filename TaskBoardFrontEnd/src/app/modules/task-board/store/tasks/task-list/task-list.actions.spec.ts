import { BoardTask, BoardTaskList, Priority } from "../../../../shared";
import { createTaskList, createTaskListFailure, createTaskListSuccess, deleteTaskList, deleteTaskListFailure, deleteTaskListSuccess, getTaskListsByBoardId, getTaskListsByBoardIdFailure, getTaskListsByBoardIdSuccess, updateTaskList, updateTaskListFailure, updateTaskListSuccess } from "./task-list.actions";

describe('Task List Actions', () => {
    const task: BoardTask = { id: '1', boardTaskListId: '1', creationTime: new Date(), name: 'Test Task', priority: Priority.Low };
    const taskList: BoardTaskList = { id: '1', boardId: '1', creationTime: new Date(), name: 'ToDo', boardTasks: [task] };
    const taskLists: BoardTaskList[] = [taskList];
    const boardId: string = "1";
    const error = { message: 'An error occurred' };

    describe('Get Task Lists By Board Id Actions', () => {
        it('should create getTaskListsByBoardId action', () => {
            const action = getTaskListsByBoardId({ boardId });
            expect(action.type).toBe('[Task List] Get Task Lists By Board Id');
            expect(action.boardId).toEqual(boardId);
        });
        it('should create getTaskListsByBoardIdSuccess action', () => {
            const action = getTaskListsByBoardIdSuccess({ taskLists });
            expect(action.type).toBe('[Task List] Get Task Lists By Board Id Success');
            expect(action.taskLists).toEqual(taskLists);
        });
        it('should create getTaskListsByBoardIdFailure action', () => {
            const action = getTaskListsByBoardIdFailure({ error });
            expect(action.type).toBe('[Task List] Get Task Lists By Board Id Failure');
            expect(action.error).toEqual(error);
        });
    });

    describe('Add New Task List Actions', () => {
        it('should create createTaskList action', () => {
            const action = createTaskList({ taskList });
            expect(action.type).toBe('[Task List] Add Task List');
            expect(action.taskList).toEqual(taskList);
        });
        it('should create createTaskListSuccess action', () => {
            const action = createTaskListSuccess({ taskList });
            expect(action.type).toBe('[Task List] Add Task List Success');
            expect(action.taskList).toEqual(taskList);
        });
        it('should create createTaskListFailure action', () => {
            const action = createTaskListFailure({ error });
            expect(action.type).toBe('[Task List] Add Task List Failure');
            expect(action.error).toEqual(error);
        });
    });

    describe('Update Task Actions', () => {
        it('should create updateTaskList action', () => {
            const action = updateTaskList({ taskList });
            expect(action.type).toBe('[Task List] Update Task List');
            expect(action.taskList).toEqual(taskList);
        });
        it('should create updateTaskListSuccess action', () => {
            const action = updateTaskListSuccess({ taskList });
            expect(action.type).toBe('[Task List] Update Task List Success');
            expect(action.taskList).toEqual(taskList);
        });
        it('should create updateTaskListFailure action', () => {
            const action = updateTaskListFailure({ error });
            expect(action.type).toBe('[Task List] Update Task List Failure');
            expect(action.error).toEqual(error);
        });
    });

    describe('Delete Task Actions', () => {
        const taskListId = '1';

        it('should create deleteTaskList action', () => {
            const action = deleteTaskList({ listId: taskListId });
            expect(action.type).toBe('[Task List] Delete Task List');
            expect(action.listId).toBe(taskListId);
        });
        it('should create deleteTaskListSuccess action', () => {
            const action = deleteTaskListSuccess({ listId: taskListId });
            expect(action.type).toBe('[Task List] Delete Task List Success');
            expect(action.listId).toBe(taskListId);
        });
        it('should create deleteTaskListFailure action', () => {
            const action = deleteTaskListFailure({ error });
            expect(action.type).toBe('[Task List] Delete Task List Failure');
            expect(action.error).toEqual(error);
        });
    });
});