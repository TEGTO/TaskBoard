import { Board, BoardTask, BoardTaskList } from "../../shared";

export interface ChangeTaskData {
    task: BoardTask;
    currentTaskList: BoardTaskList;
    prevTaskList: BoardTaskList;
    allTaskLists: BoardTaskList[];
    board: Board;
}