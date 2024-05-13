import { BoardTaskList } from "../../shared/models/board-task-list.model";
import { BoardTask } from "../../shared/models/board-task.model";

export interface TaskPopupData {
    task: BoardTask | undefined;
    currentTaskList: BoardTaskList | undefined;
    allTaskLists: BoardTaskList[] | undefined;
}