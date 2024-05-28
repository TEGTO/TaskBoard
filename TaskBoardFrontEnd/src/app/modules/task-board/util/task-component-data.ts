import { Board, BoardTaskList } from "../../shared";

export interface TaskComponentData {
    currentTaskList: BoardTaskList;
    allTaskLists: BoardTaskList[];
    board: Board;
}