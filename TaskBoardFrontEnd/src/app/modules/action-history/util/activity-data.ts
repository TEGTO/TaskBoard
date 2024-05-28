import { Board, BoardTask, BoardTaskList } from "../../shared";

export interface ActivityPopupData {
    board: Board;
}
export interface TaskActivityData {
    task: BoardTask;
    prevTask: BoardTask | undefined;
    taskList: BoardTaskList | undefined;
    board: Board;
}
export interface TaskListActivityData {
    taskList: BoardTaskList;
    prevTaskList: BoardTaskList | undefined;
    board: Board;
}