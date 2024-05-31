import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, forkJoin, map, mergeMap, of, switchMap } from "rxjs";
import { ActivityService, TaskActivityData } from "../../../../action-history";
import { ActivityType, Board, BoardTask, BoardTaskList, TaskApiService, TaskListApiService, getDefaultBoard } from "../../../../shared";
import { createNewTask, createNewTaskFailure, createNewTaskSuccess, deleteTask, deleteTaskFailure, deleteTaskSuccess, updateTask, updateTaskFailure, updateTaskSuccess } from "../../../index";

@Injectable()
export class TaskEffect {
    constructor(private actions$: Actions,
        private taskApiService: TaskApiService,
        private taskListApiService: TaskListApiService,
        private activityService: ActivityService) { }

    createNewTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createNewTask),
            mergeMap(action =>
                this.taskApiService.createNewTask(action.task).pipe(
                    map((task: BoardTask) => {
                        this.createActivity_Create(task);
                        return createNewTaskSuccess({ task: task });
                    }),
                    catchError(error => of(createNewTaskFailure({ error }))))
            )
        )
    );
    updateTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateTask),
            switchMap(action => {
                this.createActivity_Update(action.task);
                return this.taskApiService.updateTask(action.task, action.posIndex).pipe(
                    map(() => updateTaskSuccess({ prevTaskList: action.prevTaskList, task: action.task, posIndex: action.posIndex })),
                    catchError(error => of(updateTaskFailure({ error }))));
            })
        )
    );
    deleteTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteTask),
            mergeMap(action => {
                this.createActivity_Delete(action.taskId);
                return this.taskApiService.deleteTask(action.taskId).pipe(
                    map(() => deleteTaskSuccess({ taskId: action.taskId })),
                    catchError(error => of(deleteTaskFailure({ error }))));
            })
        )
    );
    private createActivity_Create(task: BoardTask) {
        this.taskListApiService.getTaskListById(task.boardTaskListId).subscribe(list => {
            if (list) {
                this.activityService.createTaskActivity(ActivityType.Create,
                    this.createTaskActivityData(task, undefined, list, { ...getDefaultBoard(), id: list.boardId }));
            }
        });
    }
    private createActivity_Update(task: BoardTask) {
        const taskList$ = this.taskListApiService.getTaskListById(task.boardTaskListId);
        const prevTask$ = this.taskApiService.getTaskById(task.id);
        forkJoin([taskList$, prevTask$]).subscribe(([list, prevTask]) => {
            if (list && prevTask) {
                this.activityService.createTaskActivity(ActivityType.Update,
                    this.createTaskActivityData(task, prevTask, list, { ...getDefaultBoard(), id: list.boardId }));
            }
        });
    }
    private createActivity_Delete(taskId: string) {
        this.taskApiService.getTaskById(taskId).subscribe((task) => {
            if (task) {
                this.taskListApiService.getTaskListById(task.boardTaskListId).subscribe(list => {
                    if (list) {
                        this.activityService.createTaskActivity(ActivityType.Delete,
                            this.createTaskActivityData(task, undefined, list, { ...getDefaultBoard(), id: list.boardId }));
                    }
                });
            }
        })
    }
    private createTaskActivityData(task: BoardTask, prevTask: BoardTask | undefined, taskList: BoardTaskList, board: Board) {
        var data: TaskActivityData = {
            task: task,
            prevTask: prevTask,
            taskList: taskList,
            board: board
        }
        return data;
    }
}