import { TestBed } from "@angular/core/testing";
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from "rxjs";
import { ActivityService } from "../../../../action-history";
import { BoardTask, BoardTaskList, TaskApiService, TaskListApiService } from "../../../../shared";
import { createTask, createTaskFailure, createTaskSuccess, deleteTask, deleteTaskFailure, deleteTaskSuccess, updateTask, updateTaskFailure, updateTaskSuccess } from "../../../index";
import { TaskEffect } from "./task.effect";

describe('TaskEffect', () => {
    var actions$: Observable<any>;
    var effects: TaskEffect;
    var mockTaskApiService: jasmine.SpyObj<TaskApiService>;
    var mockTaskListApiService: jasmine.SpyObj<TaskListApiService>;
    var mockActivityService: jasmine.SpyObj<ActivityService>;

    const mockTask: BoardTask = { id: '1', boardTaskListId: '1', creationTime: new Date(), priority: 1 };
    const mockTaskList: BoardTaskList = { id: '1', boardId: '1', creationTime: new Date(), boardTasks: [mockTask] };
    const mockPrevTaskList: BoardTaskList = { id: '1', boardId: '1', creationTime: new Date(), boardTasks: [mockTask] };
    const mockError = { message: 'An error occurred' };

    beforeEach(() => {
        mockTaskApiService = jasmine.createSpyObj<TaskApiService>('TaskApiService', ['createTask', 'updateTask', 'deleteTask', 'getTaskById']);
        mockTaskListApiService = jasmine.createSpyObj<TaskListApiService>('TaskListApiService', ['getTaskListById']);
        mockActivityService = jasmine.createSpyObj<ActivityService>('ActivityService', ['createTaskActivity']);
        mockTaskApiService.getTaskById.and.returnValue(of(mockTask));
        mockTaskListApiService.getTaskListById.and.returnValue(of(mockTaskList));

        TestBed.configureTestingModule({
            providers: [
                TaskEffect,
                provideMockActions(() => actions$),
                { provide: TaskApiService, useValue: mockTaskApiService },
                { provide: TaskListApiService, useValue: mockTaskListApiService },
                { provide: ActivityService, useValue: mockActivityService },
            ]
        });

        effects = TestBed.inject(TaskEffect);
    });

    describe('createNewTask$', () => {
        it('should return a createNewTaskSuccess action, with task, on success', (done) => {
            const action = createTask({ task: mockTask });
            const outcome = createTaskSuccess({ task: mockTask });

            actions$ = of(action);
            mockTaskApiService.createTask.and.returnValue(of(mockTask));

            effects.createTask$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskApiService.createTask).toHaveBeenCalledWith(mockTask);
                done();
            });
        });

        it('should return a createNewTaskFailure action, with error, on failure', (done) => {
            const action = createTask({ task: mockTask });
            const outcome = createTaskFailure({ error: mockError });

            actions$ = of(action);
            mockTaskApiService.createTask.and.returnValue(throwError(mockError));

            effects.createTask$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskApiService.createTask).toHaveBeenCalledWith(mockTask);
                done();
            });
        });
    });

    describe('updateTask$', () => {
        it('should return a updateTaskSuccess action, with task, on success', (done) => {
            const action = updateTask({ prevTaskList: mockPrevTaskList, task: mockTask, posIndex: 0 });
            const outcome = updateTaskSuccess({ prevTaskList: mockPrevTaskList, task: mockTask, posIndex: 0 });

            actions$ = of(action);
            mockTaskApiService.updateTask.and.returnValue(of({}));

            effects.updateTask$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskApiService.updateTask).toHaveBeenCalledWith(mockTask, 0);
                done();
            });
        });

        it('should return a updateTaskFailure action, with error, on failure', (done) => {
            const action = updateTask({ prevTaskList: mockPrevTaskList, task: mockTask, posIndex: 0 });
            const outcome = updateTaskFailure({ error: mockError });

            actions$ = of(action);
            mockTaskApiService.updateTask.and.returnValue(throwError(mockError));

            effects.updateTask$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskApiService.updateTask).toHaveBeenCalledWith(mockTask, 0);
                done();
            });
        });
    });

    describe('deleteTask$', () => {
        it('should return a deleteTaskSuccess action, with taskId, on success', (done) => {
            const action = deleteTask({ taskId: '1' });
            const outcome = deleteTaskSuccess({ taskId: '1' });

            actions$ = of(action);
            mockTaskApiService.deleteTask.and.returnValue(of({}));

            effects.deleteTask$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskApiService.deleteTask).toHaveBeenCalledWith('1');
                done();
            });
        });

        it('should return a deleteTaskFailure action, with error, on failure', (done) => {
            const action = deleteTask({ taskId: '1' });
            const outcome = deleteTaskFailure({ error: mockError });

            actions$ = of(action);
            mockTaskApiService.deleteTask.and.returnValue(throwError(mockError));

            effects.deleteTask$.subscribe(result => {
                expect(result).toEqual(outcome);
                expect(mockTaskApiService.deleteTask).toHaveBeenCalledWith('1');
                done();
            });
        });
    });
}); 