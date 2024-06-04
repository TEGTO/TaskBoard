import { moveItemInArray } from "@angular/cdk/drag-drop";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { ActivityService, TaskActivityData, TaskListActivityData } from "../../../app/modules/action-history";
import { ActivityType, Board, BoardActivity, BoardTask, BoardTaskActivity, BoardTaskList, Priority, RedirectorService, copyTaskListValues, copyTaskValues } from "../../../app/modules/shared";
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
export const mockTaskLotOfText: BoardTask = {
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
    name: "Task List 1111111111111111111111111111111111111111111111111111111111111111111111111111",
    boardTasks: [mockTask, mockTaskLotOfText]
};
export const mockTaskListLotOfText: BoardTaskList =
{
    id: "2",
    boardId: "1",
    creationTime: new Date(),
    name: "Task List with a big nameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    boardTasks: []
};
export const mockBoard: Board =
{
    id: "1",
    userId: "1",
    creationTime: new Date(),
    name: "Board 1",
}
export const mockBoard2: Board =
{
    id: "2",
    userId: "1",
    creationTime: new Date(),
    name: "Board 2",
}
export const mockBoardLotOfText: Board =
{
    id: "2",
    userId: "1",
    creationTime: new Date(),
    name: "Board 2 with a big nameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee eeeeeeeeeeeeeeeeeeeeeee",
}
const allMockTasks = [mockTask, mockTaskLotOfText];
var mockTaskLists = [mockTaskList];
var mockBoards = [mockBoard, mockBoard2];
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
export class MockMatDialogRef<T> {
    close(value = ''): void { }
    afterClosed() {
        return of(true);
    }
}
var currentBoard: BehaviorSubject<Board | undefined>;
@Injectable()
export class MockBoardService extends BoardService {
    override getBoardsByUserId(): Observable<Board[]> {
        return of(mockBoards);
    }
    override getBoardById(id: string): Observable<Board | undefined> {
        var board = mockBoards.find(x => x.id == id);
        currentBoard = new BehaviorSubject(board);
        return currentBoard;
    }
    override getTaskListsAmountByBoardId(id: string): Observable<number> {
        throw new Error("Method not implemented.");
    }
    override getTasksAmountByBoardId(id: string): Observable<number> {
        throw new Error("Method not implemented.");
    }
    override createBoard(board: Board): void {
        throw new Error("Method not implemented.");
    }
    override updateBoard(board: Board): void {
        throw new Error("Method not implemented.");
    }
    override deleteBoard(board: Board): void {
        throw new Error("Method not implemented.");
    }
}
@Injectable()
export class MockRedirectorService extends RedirectorService {
    override redirectToHome(): void {
        throw new Error("Method not implemented.");
    }
    override redirectToBoard(boardId: string): void {
        var board = mockBoards.find(x => x.id == boardId);
        currentBoard.next(board);
    }
}