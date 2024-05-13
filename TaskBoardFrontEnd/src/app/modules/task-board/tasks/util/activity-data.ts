import { BoardTaskList } from "../../shared/models/board-task-list.model";
import { BoardTask } from "../../shared/models/board-task.model";

export interface TaskActivityData {
    task: BoardTask;
    prevTask: BoardTask | undefined;
    taskList: BoardTaskList | undefined;
}
export interface TaskListActivityData {
    taskList: BoardTaskList;
    prevTaskList: BoardTaskList | undefined;
}