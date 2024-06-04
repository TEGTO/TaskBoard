import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ActivityService, TaskActivityData, TaskListActivityData } from "../../../app/modules/action-history";
import { ActivityType, BoardActivity, BoardTask, BoardTaskActivity, BoardTaskList, Priority, copyTaskValues } from "../../../app/modules/shared";
import { TaskListService, TaskService } from "../../../app/modules/task-board";

export const mockTask: BoardTask = {
    id: "1",
    boardTaskListId: "1",
    creationTime: new Date(),
    dueTime: new Date(),
    name: "Test Task 1",
    description: "Description",
    priority: Priority.High
}
export const mockTaskMuchText: BoardTask = {
    id: "2",
    boardTaskListId: "1",
    creationTime: new Date(),
    dueTime: new Date(),
    name: "Test With a lot of textttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt",
    description: "Descriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
    priority: Priority.High
}
const allMockTasks = [mockTask, mockTaskMuchText];
const mockTaskLists = [
    {
        id: "1",
        boardId: "1",
        creationTime: new Date(),
        name: "Task List 1",
        boardTasks: [mockTask, mockTaskMuchText]
    }
]
@Injectable()
export class MockTaskListService extends TaskListService {
    override getTaskListsByBoardId(id: string): Observable<BoardTaskList[]> {
        return of(mockTaskLists.filter(x => x.boardId == id));
    }
    override getTaskListById(id: string): Observable<BoardTaskList | undefined> {
        return of(mockTaskLists.find(x => x.id == id));
    }
    override createTaskList(taskList: BoardTaskList): void {
        throw new Error("Method not implemented.");
    }
    override updateTaskList(taskList: BoardTaskList): void {
        throw new Error("Method not implemented.");
    }
    override deleteTaskList(taskList: BoardTaskList): void {
        throw new Error("Method not implemented.");
    }
}
@Injectable()
export class MockTaskService extends TaskService {
    override createTask(task: BoardTask): void {
    }
    override updateTask(prevTaskList: BoardTaskList, task: BoardTask, currentIndex: number): void {
        var oldTaskData = allMockTasks.find(x => x.id == task.id);
        if (oldTaskData)
            copyTaskValues(oldTaskData, task);
    }
    override deleteTask(task: BoardTask): void {
        task.name = "Deleted";
    }
}
const mockTaskActivities: BoardTaskActivity[] =
    [
        {
            id: "1",
            boardTaskId: "1",
            activityTime: new Date(),
            description: "Activity deacription1"
        },
        {
            id: "2",
            boardTaskId: "1",
            activityTime: new Date(),
            description: "Activity deacription2"
        },
        {
            id: "3",
            boardTaskId: "1",
            activityTime: new Date(),
            description: "Activity deacription3"
        },
        {
            id: "4",
            boardTaskId: "2",
            activityTime: new Date(),
            description: "Activity deacriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn nnnnnnnnnnnnnnnnnnnnnnnnnnnnnn"
        },
        {
            id: "5",
            boardTaskId: "2",
            activityTime: new Date(),
            description: "Activity deacriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn nnnnnnnnnnnnnnnnnnnnnnnnnnnnnn"
        }
    ]
@Injectable()
export class MockActivityService extends ActivityService {
    override getTaskActivitiesByTaskId(taskId: string): Observable<BoardTaskActivity[]> {
        return of(mockTaskActivities.filter(x => x.boardTaskId == taskId));
    }
    override getBoardActivitiesOnPageByBoardId(id: string, page: number, amountOnPage: number): Observable<BoardActivity[]> {
        throw new Error("Method not implemented.");
    }
    override getBoardActivityAmountByBoardId(id: string): Observable<number> {
        throw new Error("Method not implemented.");
    }
    override createTaskActivity(activityType: ActivityType, taskActivityData: TaskActivityData): void {
    }
    override createTaskListActivity(activityType: ActivityType, listActivityData: TaskListActivityData): void {
    }
}