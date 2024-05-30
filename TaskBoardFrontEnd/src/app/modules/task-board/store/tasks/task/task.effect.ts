import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { BoardTask, TaskApiService } from "../../../../shared";
import { createNewTask, createNewTaskFailure, createNewTaskSuccess, deleteTask, deleteTaskFailure, deleteTaskSuccess, updateTask, updateTaskFailure, updateTaskSuccess } from "../../../index";

@Injectable()
export class TaskEffect {
    constructor(private actions$: Actions,
        private apiService: TaskApiService) { }

    createNewTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createNewTask),
            mergeMap(action =>
                this.apiService.createNewTask(action.task).pipe(
                    map((task: BoardTask) => createNewTaskSuccess({ task: task })),
                    catchError(error => of(createNewTaskFailure({ error })))
                )
            )
        )
    );
    updateTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateTask),
            switchMap(action =>
                this.apiService.getTaskById(action.task.id).pipe(
                    switchMap(prevTask => {
                        return this.apiService.updateTask(action.task, action.posIndex).pipe(
                            map(() => updateTaskSuccess({ task: action.task })),
                            catchError(error => of(updateTaskFailure({ error })))
                        );
                    }
                    )
                )
            )
        )
    );
    deleteTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteTask),
            mergeMap(action =>
                this.apiService.deleteTask(action.task.id).pipe(
                    map(() => deleteTaskSuccess({ taskId: action.task.id })),
                    catchError(error => of(deleteTaskFailure({ error })))
                )
            )
        )
    );
}