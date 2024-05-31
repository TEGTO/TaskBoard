import { BoardTaskList } from "../../shared";

export interface TaskListsPopupData {
    taskList: BoardTaskList | undefined;
    boardId: string;
}