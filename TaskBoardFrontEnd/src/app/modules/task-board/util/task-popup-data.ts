import { Board, BoardTask, BoardTaskList } from "../../shared";

export interface TaskPopupData {
    task: BoardTask | undefined;
    currentTaskList: BoardTaskList | undefined;
    allTaskLists: BoardTaskList[] | undefined;
    board: Board;
}