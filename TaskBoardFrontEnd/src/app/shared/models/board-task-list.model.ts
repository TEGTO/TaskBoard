import { BoardTask } from "./board-task.model";

export interface BoardTaskList {
    id: string;
    userId: string;
    creationTime: Date;
    name?: string;
    boardTasks: BoardTask[];
}
export function getDefaultBoardTaskList() {
    const taskList: BoardTaskList = {
        id: "",
        userId: "",
        creationTime: new Date,
        name: "",
        boardTasks: []
    };
    return taskList;
}
export function copyTaskListValues(dest: BoardTaskList, copied: BoardTaskList) {
    if (dest && copied) {
        dest.id = copied?.id;
        dest.userId = copied?.userId;
        dest.creationTime = copied?.creationTime;
        dest.name = copied?.name;
        dest.boardTasks = copied?.boardTasks;
    }
}