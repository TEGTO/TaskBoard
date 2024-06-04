import { moveItemInArray } from "@angular/cdk/drag-drop";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { ActivityService, TaskActivityData, TaskListActivityData } from "../../../app/modules/action-history";
import { ActivityType, Board, BoardActivity, BoardTask, BoardTaskActivity, BoardTaskList, Priority, RedirectorService, copyBoardValues, copyTaskListValues, copyTaskValues } from "../../../app/modules/shared";
import { BoardService, TaskListService, TaskService } from "../../../app/modules/task-board";

export const mockTask: BoardTask = {
    id: "1",
    boardTaskListId: "1",
    creationTime: new Date(),
    dueTime: new Date(),
    name: "Test Task 1",
    description: "Description",
    priority: Priority.High
}
export const mockTaskLongText: BoardTask = {
    id: "2",
    boardTaskListId: "1",
    creationTime: new Date(),
    dueTime: new Date(),
    name: "Test with a lot of textttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt",
    description: "Descriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
    priority: Priority.High
}
export const mockTaskList: BoardTaskList =
{
    id: "1",
    boardId: "1",
    creationTime: new Date(),
    name: "Task List 1",
    boardTasks: [mockTask]
};
export const mockTaskListWithLongText: BoardTaskList =
{
    id: "2",
    boardId: "1",
    creationTime: new Date(),
    name: "Task List 222222222222222222222222222222222222222222222222 222222222222222222222222222 2222222222222222222222222222222222222222",
    boardTasks: [mockTaskLongText]
};
export const mockBoard: Board =
{
    id: "1",
    userId: "1",
    creationTime: new Date(),
    name: "Board 1",
}
export const mockBoardWithLongText: Board =
{
    id: "2",
    userId: "1",
    creationTime: new Date(),
    name: "Board 2222222222222222222222222222222222222222222222222222 222222222222222222222222222222222222222222222222222222 222222222222222",
}

const allMockTasks = [mockTask, mockTaskLongText];
var mockTaskLists = [mockTaskList, mockTaskListWithLongText];
var mockBoards = [mockBoard, mockBoardWithLongText];
@Injectable()
export class MockTaskListService extends TaskListService {
    private observables: Map<string, BehaviorSubject<BoardTaskList[]>> = new Map();


    override getTaskListsByBoardId(id: string): Observable<BoardTaskList[]> {
        var obs = new BehaviorSubject(mockTaskLists.filter(x => x.boardId == id));
        this.observables.set(id, obs);
        return obs;
    }
    override getTaskListById(id: string): Observable<BoardTaskList | undefined> {
        return of(mockTaskLists.find(x => x.id == id));
    }
    override createTaskList(taskList: BoardTaskList): void {
        taskList.id = this.getRandomInt(10000).toString();
        mockTaskLists.push(taskList);
        this.observables.get(taskList.boardId)!.next(mockTaskLists);
    }
    override updateTaskList(taskList: BoardTaskList): void {
        var oldListData = mockTaskLists.find(x => x.id == taskList.id);
        if (oldListData)
            copyTaskListValues(oldListData, taskList);
        this.observables.get(taskList.boardId)!.next(mockTaskLists);
    }
    override deleteTaskList(taskList: BoardTaskList): void {
        mockTaskLists = mockTaskLists.filter(x => x.id != taskList.id);
        this.observables.get(taskList.boardId)!.next(mockTaskLists);
    }
    private getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }
}
@Injectable()
export class MockTaskService extends TaskService {
    override createTask(task: BoardTask): void {
        var taskList = mockTaskLists.find(x => x.id == task.boardTaskListId);
        if (taskList) {
            taskList.boardTasks.unshift(task);
        }
    }
    override updateTask(prevTaskList: BoardTaskList, task: BoardTask, currentIndex: number): void {
        var oldTaskData = allMockTasks.find(x => x.id == task.id);
        if (oldTaskData)
            copyTaskValues(oldTaskData, task);
        var currentTaskList = mockTaskLists.find(x => x.id == task.boardTaskListId);
        if (currentTaskList) {
            if (prevTaskList.id == task.boardTaskListId) {
                var oldTaskIndex = currentTaskList.boardTasks.findIndex(x => x.id == task.id);
                moveItemInArray(currentTaskList.boardTasks, oldTaskIndex, currentIndex);
            }
            else {
                prevTaskList.boardTasks = prevTaskList.boardTasks.filter(x => x.id != task.id);
                this.createTask(task);
                moveItemInArray(currentTaskList.boardTasks, 0, currentIndex);
            }
        }
    }
    override deleteTask(task: BoardTask): void {
        var taskList = mockTaskLists.find(x => x.id == task.boardTaskListId);
        if (taskList) {
            taskList.boardTasks = taskList.boardTasks.filter(x => x.id != task.id);
        }
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
const mockActivities: BoardActivity[] =
    [
        {
            id: "1",
            boardId: "1",
            activityTime: new Date(),
            description: "Activity deacription1"
        },
        {
            id: "2",
            boardId: "1",
            activityTime: new Date(),
            description: "Activity deacription2"
        },
        {
            id: "3",
            boardId: "1",
            activityTime: new Date(),
            description: "Activity deacription3"
        },
        {
            id: "4",
            boardId: "2",
            activityTime: new Date(),
            description: "Activity deacriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn nnnnnnnnnnnnnnnnnnnnnnnnnnnnnn"
        },
        {
            id: "5",
            boardId: "2",
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
        const startIndex = (page - 1) * amountOnPage;
        const activities = mockActivities.filter(x => x.boardId == id).slice(startIndex, startIndex + amountOnPage);
        return of(activities);
    }
    override getBoardActivityAmountByBoardId(id: string): Observable<number> {
        return of(mockActivities.filter(x => x.boardId == id).length);
    }
    override createTaskActivity(activityType: ActivityType, taskActivityData: TaskActivityData): void {
    }
    override createTaskListActivity(activityType: ActivityType, listActivityData: TaskListActivityData): void {
    }
}
export class MockMatDialogRef<T> {
    close(value = ''): void { }
    afterClosed() {
        return of(true);
    }
}
@Injectable()
export class MockBoardService extends BoardService {
    override getBoardsByUserId(): Observable<Board[]> {
        return of(mockBoards);
    }
    override getBoardById(id: string): Observable<Board | undefined> {
        var board = mockBoards.find(x => x.id == id);
        return of(board);
    }
    override getTaskListsAmountByBoardId(id: string): Observable<number> {
        return of(mockTaskLists.filter(x => x.boardId == id).length);
    }
    getTasksAmountByBoardId(id: string): Observable<number> {
        const totalTasks = mockTaskLists
            .filter(x => x.boardId === id)
            .reduce((sum, taskList) => sum + taskList.boardTasks.length, 0);

        return of(totalTasks);
    }
    override createBoard(board: Board): void {
        mockBoards.push(board);
    }
    override updateBoard(board: Board): void {
        var oldData = mockBoards.find(x => x.id == board.id);
        if (oldData)
            copyBoardValues(oldData, board);
    }
    override deleteBoard(board: Board): void {
        mockBoards = mockBoards.filter(x => x.id != board.id);
    }
}
@Injectable()
export class MockRedirectorService extends RedirectorService {
    override redirectToHome(): void {
    }
    override redirectToBoard(boardId: string): void {
    }
}