import { Priority } from "../enums/priority.enum";

export interface BoardTask {
    id: string;
    boardTaskListId: string;
    creationTime: Date;
    dueTime?: Date;
    name?: string;
    description?: string;
    priority: Priority;
    prevTaskId?: string;
    nextTaskId?: string;
}
export function getDefaultBoardTask() {
    const task: BoardTask = {
        id: '',
        name: '',
        boardTaskListId: '',
        creationTime: new Date(),
        priority: Priority.Low,
        description: '',
    };
    return task;
}
export function copyTaskValues(dest: BoardTask, toCopy: BoardTask) {
    if (dest && toCopy) {
        dest.id = toCopy?.id;
        dest.boardTaskListId = toCopy?.boardTaskListId;
        dest.creationTime = toCopy?.creationTime;
        dest.dueTime = toCopy?.dueTime;
        dest.name = toCopy?.name;
        dest.description = toCopy?.description;
        dest.priority = toCopy?.priority;
        dest.prevTaskId = toCopy?.prevTaskId;
        dest.nextTaskId = toCopy?.nextTaskId;
    }
}
