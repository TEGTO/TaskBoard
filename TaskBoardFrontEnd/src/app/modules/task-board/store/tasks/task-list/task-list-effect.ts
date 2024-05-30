import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { BoardTaskList, TaskListApiService } from "../../../../shared";
import { createNewTaskFailure, createTaskList, createTaskListSuccess, getTaskListsByBoardId, getTaskListsByBoardIdFailure, getTaskListsByBoardIdSuccess, removeTaskList, removeTaskListFailure, removeTaskListSuccess, updateTaskList, updateTaskListFailure, updateTaskListSuccess } from "../../../index";

@Injectable()
export class TaskListEffect {
    constructor(private actions$: Actions,
        private apiService: TaskListApiService) { }

    loadTaskLists$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getTaskListsByBoardId),
            mergeMap(action =>
                this.apiService.getTaskListsByBoardId(action.boardId).pipe(
                    map((taskLists: BoardTaskList[]) => getTaskListsByBoardIdSuccess({ taskLists: taskLists })),
                    catchError(error => of(getTaskListsByBoardIdFailure({ error })))
                )
            )
        )
    );
    createNewTaskList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createTaskList),
            mergeMap(action =>
                this.apiService.createNewTaskList(action.taskList).pipe(
                    map((taskLists: BoardTaskList) => createTaskListSuccess({ taskList: taskLists })),
                    catchError(error => of(createNewTaskFailure({ error })))
                )
            )
        )
    );
    updateTaskList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateTaskList),
            mergeMap(action =>
                this.apiService.updateTaskList(action.taskList).pipe(
                    map(() => updateTaskListSuccess({ taskList: action.taskList })),
                    catchError(error => of(updateTaskListFailure({ error })))
                )
            )
        )
    );
    removeTaskList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(removeTaskList),
            mergeMap(action =>
                this.apiService.deleteTaskList(action.listId).pipe(
                    map(() => removeTaskListSuccess({ listId: action.listId })),
                    catchError(error => of(removeTaskListFailure({ error })))
                )
            )
        )
    );
}