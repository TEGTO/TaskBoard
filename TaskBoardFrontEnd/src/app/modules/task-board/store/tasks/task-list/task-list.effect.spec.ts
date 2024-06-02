import { TestBed } from "@angular/core/testing";
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from "rxjs";
import { ActivityService } from "../../../../action-history";
import { BoardTask, BoardTaskList, TaskListApiService } from "../../../../shared";
import { TaskListEffect, createTaskList, createTaskListFailure, createTaskListSuccess, deleteTaskList, deleteTaskListFailure, deleteTaskListSuccess, getTaskListsByBoardId, getTaskListsByBoardIdFailure, getTaskListsByBoardIdSuccess, updateTaskList, updateTaskListFailure, updateTaskListSuccess } from "../../../index";

describe('TaskListEffect', () => {
    var actions$: Observable<any>;
    var effects: TaskListEffect;
    var mockTaskListApiService: jasmine.SpyObj<TaskListApiService>;
    var mockActivityService: jasmine.SpyObj<ActivityService>;

    const mockTask: BoardTask = { id: '1', boardTaskListId: '1', creationTime: new Date(), priority: 1 };
    const mockTaskList: BoardTaskList = { id: '1', boardId: '1', creationTime: new Date(), boardTasks: [mockTask] };
    const mockTaskLists: BoardTaskList[] = [mockTaskList];
    const mockBoardId: string = "1";
    const mockError = { message: 'An error occurred' };

    beforeEach(() => {
        mockTaskListApiService = jasmine.createSpyObj<TaskListApiService>('TaskListApiService', ['getTaskListsByBoardId', 'getTaskListById', 'createTaskList', 'updateTaskList', 'deleteTaskList']);
        mockActivityService = jasmine.createSpyObj<ActivityService>('ActivityService', ['createTaskListActivity']);
        mockTaskListApiService.getTaskListById.and.returnValue(of(mockTaskList));

        TestBed.configureTestingModule({
            providers: [
                TaskListEffect,
                provideMockActions(() => actions$),
                { provide: TaskListApiService, useValue: mockTaskListApiService },
                { provide: ActivityService, useValue: mockActivityService },
            ]
        });

        effects = TestBed.inject(TaskListEffect);
    });
    describe('loadTaskLists$', () => {
        it('should return a getTaskListsByBoardIdSuccess action, with taskLists, on success', (done) => {
            const action = getTaskListsByBoardId({ boardId: mockBoardId });
            const outcome = getTaskListsByBoardIdSuccess({ taskLists: mockTaskLists });

            actions$ = of(action);
            mockTaskListApiService.getTaskListsByBoardId.and.returnValue(of(mockTaskLists));

            effects.loadTaskLists$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskListApiService.getTaskListsByBoardId).toHaveBeenCalledWith(mockBoardId);
                done();
            });
        });
        it('should return a getTaskListsByBoardIdFailure action, with error, on failure', (done) => {
            const action = getTaskListsByBoardId({ boardId: mockBoardId });
            const outcome = getTaskListsByBoardIdFailure({ error: mockError });

            actions$ = of(action);
            mockTaskListApiService.getTaskListsByBoardId.and.returnValue(throwError(mockError));

            effects.loadTaskLists$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskListApiService.getTaskListsByBoardId).toHaveBeenCalledWith(mockBoardId);
                done();
            });
        });
    });

    describe('createTaskList$', () => {
        it('should return a createTaskListSuccess action, with taskList, on success', (done) => {
            const action = createTaskList({ taskList: mockTaskList });
            const outcome = createTaskListSuccess({ taskList: mockTaskList });

            actions$ = of(action);
            mockTaskListApiService.createTaskList.and.returnValue(of(mockTaskList));

            effects.createTaskList$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskListApiService.createTaskList).toHaveBeenCalledWith(mockTaskList);
                done();
            });
        });
        it('should return a createTaskListFailure action, with error, on failure', (done) => {
            const action = createTaskList({ taskList: mockTaskList });
            const outcome = createTaskListFailure({ error: mockError });

            actions$ = of(action);
            mockTaskListApiService.createTaskList.and.returnValue(throwError(mockError));

            effects.createTaskList$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskListApiService.createTaskList).toHaveBeenCalledWith(mockTaskList);
                done();
            });
        });
    });

    describe('updateTaskList$', () => {
        it('should return a updateTaskListSuccess action, with taskList, on success', (done) => {
            const action = updateTaskList({ taskList: mockTaskList });
            const outcome = updateTaskListSuccess({ taskList: mockTaskList });

            actions$ = of(action);
            mockTaskListApiService.updateTaskList.and.returnValue(of({}));

            effects.updateTaskList$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskListApiService.updateTaskList).toHaveBeenCalledWith(mockTaskList);
                done();
            });
        });
        it('should return a updateTaskListFailure action, with error, on failure', (done) => {
            const action = updateTaskList({ taskList: mockTaskList });
            const outcome = updateTaskListFailure({ error: mockError });

            actions$ = of(action);
            mockTaskListApiService.updateTaskList.and.returnValue(throwError(mockError));

            effects.updateTaskList$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskListApiService.updateTaskList).toHaveBeenCalledWith(mockTaskList);
                done();
            });
        });
    });

    describe('deleteTaskList$', () => {
        it('should return a deleteTaskListSuccess action, with listId, on success', (done) => {
            const action = deleteTaskList({ listId: '1' });
            const outcome = deleteTaskListSuccess({ listId: '1' });

            actions$ = of(action);
            mockTaskListApiService.deleteTaskList.and.returnValue(of({}));

            effects.deleteTaskList$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskListApiService.deleteTaskList).toHaveBeenCalledWith('1');
                done();
            });
        });
        it('should return a deleteTaskListFailure action, with error, on failure', (done) => {
            const action = deleteTaskList({ listId: '1' });
            const outcome = deleteTaskListFailure({ error: mockError });

            actions$ = of(action);
            mockTaskListApiService.deleteTaskList.and.returnValue(throwError(mockError));

            effects.deleteTaskList$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskListApiService.deleteTaskList).toHaveBeenCalledWith('1');
                done();
            });
        });
    });
}); 