import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { ActivityService, TaskListActivityData } from "../../../../action-history";
import { ActivityType, Board, BoardTaskList, TaskListApiService, getDefaultBoard } from "../../../../shared";
import { createTaskList, createTaskListFailure, createTaskListSuccess, deleteTaskList, deleteTaskListFailure, deleteTaskListSuccess, getTaskListsByBoardId, getTaskListsByBoardIdFailure, getTaskListsByBoardIdSuccess, updateTaskList, updateTaskListFailure, updateTaskListSuccess } from "../../../index";

@Injectable()
export class TaskListEffect {
    constructor(private actions$: Actions,
        private apiService: TaskListApiService,
        private activityService: ActivityService) { }

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
    createTaskList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createTaskList),
            mergeMap(action =>
                this.apiService.createTaskList(action.taskList).pipe(
                    map((taskList: BoardTaskList) => {
                        this.createActivity_Create(taskList);
                        return createTaskListSuccess({ taskList: taskList });
                    }),
                    catchError(error => of(createTaskListFailure({ error })))
                ))
        )
    );
    updateTaskList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateTaskList),
            mergeMap(action => {
                this.createActivity_Update(action.taskList);
                return this.apiService.updateTaskList(action.taskList).pipe(
                    map(() => updateTaskListSuccess({ taskList: action.taskList })),
                    catchError(error => of(updateTaskListFailure({ error }))))
            })
        )
    );
    deleteTaskList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteTaskList),
            mergeMap(action => {
                this.createActivity_Delete(action.listId);
                return this.apiService.deleteTaskList(action.listId).pipe(
                    map(() => deleteTaskListSuccess({ listId: action.listId })),
                    catchError(error => of(deleteTaskListFailure({ error })))
                )
            })
        )
    );
    private createActivity_Create(taskList: BoardTaskList) {
        this.activityService.createTaskListActivity(ActivityType.Create,
            this.createTaskListActivityData(taskList, undefined, { ...getDefaultBoard(), id: taskList.boardId }));
    }
    private createActivity_Update(taskList: BoardTaskList) {
        this.apiService.getTaskListById(taskList.id).subscribe((prevList) => {
            if (prevList) {
                this.activityService.createTaskListActivity(ActivityType.Update,
                    this.createTaskListActivityData(taskList, prevList, { ...getDefaultBoard(), id: taskList.boardId })
                );
            }
        });
    }
    private createActivity_Delete(taskListId: string) {
        this.apiService.getTaskListById(taskListId).subscribe(taskList => {
            if (taskList) {
                this.activityService.createTaskListActivity(ActivityType.Delete,
                    this.createTaskListActivityData(taskList, undefined, { ...getDefaultBoard(), id: taskList.boardId })
                );
            }
        });
    }
    private createTaskListActivityData(taskList: BoardTaskList, prevTaskList: BoardTaskList | undefined, board: Board) {
        var data: TaskListActivityData = {
            taskList: taskList,
            prevTaskList: prevTaskList,
            board: board
        }
        return data;
    }
}
