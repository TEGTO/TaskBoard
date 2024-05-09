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
    isHead: boolean;
    nextTaskId?: string;
}
export function getDefaultBoardTask() {
    const task: BoardTask = {
        id: '',
        name: '',
        boardTaskListId: '',
        creationTime: new Date(),
        priority: Priority.Low,
        isHead: true,
        description: '',
    };
    return task;
}
export function copyTaskValues(dest: BoardTask, copied: BoardTask) {
    if (dest && copied) {
        dest.id = copied?.id;
        dest.boardTaskListId = copied?.boardTaskListId;
        dest.creationTime = copied?.creationTime;
        dest.dueTime = copied?.dueTime;
        dest.name = copied?.name;
        dest.description = copied?.description;
        dest.priority = copied?.priority;
        dest.prevTaskId = copied?.prevTaskId;
        dest.isHead = copied?.isHead;
        dest.nextTaskId = copied?.nextTaskId;
    }
}
