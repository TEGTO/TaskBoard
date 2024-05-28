import { Board, BoardTaskList } from "../../shared";

export interface ChangeTaskListData {
    taskList: BoardTaskList;
    allTaskLists: BoardTaskList[];
    board: Board;
}