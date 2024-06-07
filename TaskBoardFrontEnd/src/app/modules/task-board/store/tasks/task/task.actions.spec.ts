import { BoardTask, BoardTaskList, Priority } from "../../../../shared";
import { createTask, createTaskFailure, createTaskSuccess, deleteTask, deleteTaskFailure, deleteTaskSuccess, updateTask, updateTaskFailure, updateTaskSuccess } from "./task.actions";

describe('Task Actions', () => {
    const task: BoardTask = { id: '1', boardTaskListId: '1', creationTime: new Date(), name: 'Test Task', priority: Priority.Low };
    const prevTaskList: BoardTaskList = { id: '1', boardId: '1', creationTime: new Date(), name: 'ToDo', boardTasks: [task] };
    const posIndex = 0;
    const error = { message: 'An error occurred' };

    describe('Create New Task Actions', () => {
        it('should create createNewTask action', () => {
            const action = createTask({ task });
            expect(action.type).toBe('[Task] Create Task');
            expect(action.task).toEqual(task);
        });
        it('should create createNewTaskSuccess action', () => {
            const action = createTaskSuccess({ task });
            expect(action.type).toBe('[Task] Create Task Success');
            expect(action.task).toEqual(task);
        });
        it('should create createNewTaskFailure action', () => {
            const action = createTaskFailure({ error });
            expect(action.type).toBe('[Task] Create Task Failure');
            expect(action.error).toEqual(error);
        });
    });

    describe('Update Task Actions', () => {
        it('should create updateTask action', () => {
            const action = updateTask({ prevTaskList, task, posIndex });
            expect(action.type).toBe('[Task] Update Task');
            expect(action.prevTaskList).toEqual(prevTaskList);
            expect(action.task).toEqual(task);
            expect(action.posIndex).toBe(posIndex);
        });
        it('should create updateTaskSuccess action', () => {
            const action = updateTaskSuccess({ prevTaskList, task, posIndex });
            expect(action.type).toBe('[Task] Update Task Success');
            expect(action.prevTaskList).toEqual(prevTaskList);
            expect(action.task).toEqual(task);
            expect(action.posIndex).toBe(posIndex);
        });
        it('should create updateTaskFailure action', () => {
            const action = updateTaskFailure({ error });
            expect(action.type).toBe('[Task] Update Task Failure');
            expect(action.error).toEqual(error);
        });
    });

    describe('Delete Task Actions', () => {
        const taskId = '1';

        it('should create deleteTask action', () => {
            const action = deleteTask({ taskId });
            expect(action.type).toBe('[Task] Delete Task');
            expect(action.taskId).toBe(taskId);
        });
        it('should create deleteTaskSuccess action', () => {
            const action = deleteTaskSuccess({ taskId });
            expect(action.type).toBe('[Task] Delete Task Success');
            expect(action.taskId).toBe(taskId);
        });
        it('should create deleteTaskFailure action', () => {
            const action = deleteTaskFailure({ error });
            expect(action.type).toBe('[Task] Delete Task Failure');
            expect(action.error).toEqual(error);
        });
    });
});