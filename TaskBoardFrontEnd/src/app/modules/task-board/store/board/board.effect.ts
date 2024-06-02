import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { Board, BoardApiService } from "../../../shared";
import { createBoard, createBoardFailure, createBoardSuccess, deleteBoard, deleteBoardFailure, deleteBoardSuccess, getBoardsByUserId, getBoardsByUserIdFailure, getBoardsByUserIdSuccess, updateBoard, updateBoardFailure, updateBoardSuccess } from "../../index";

@Injectable()
export class BoardEffects {
    constructor(private actions$: Actions,
        private apiService: BoardApiService) { }

    loadBoards$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getBoardsByUserId),
            mergeMap(() =>
                this.apiService.getBoardsByUserId().pipe(
                    map((boards: Board[]) => getBoardsByUserIdSuccess({ boards: boards })),
                    catchError(error => of(getBoardsByUserIdFailure({ error })))
                )
            )
        )
    );
    createBoard$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createBoard),
            mergeMap(action =>
                this.apiService.createBoard(action.board).pipe(
                    map((board: Board) => createBoardSuccess({ board: board })),
                    catchError(error => of(createBoardFailure({ error })))
                )
            )
        )
    );
    updateBoard$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateBoard),
            mergeMap(action =>
                this.apiService.updateBoard(action.board).pipe(
                    map(() => updateBoardSuccess({ board: action.board })),
                    catchError(error => of(updateBoardFailure({ error })))
                )
            )
        )
    );
    deleteBoard$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteBoard),
            mergeMap(action =>
                this.apiService.deleteBoard(action.boardId).pipe(
                    map(() => deleteBoardSuccess({ boardId: action.boardId })),
                    catchError(error => of(deleteBoardFailure({ error })))
                )
            )
        )
    );
}