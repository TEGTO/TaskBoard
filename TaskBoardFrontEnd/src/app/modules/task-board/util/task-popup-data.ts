import { BoardTask } from "../../shared";

export interface TaskPopupData {
    task: BoardTask | undefined;
    taskListId: string;
    boardId: string;
}