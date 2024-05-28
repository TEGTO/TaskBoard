import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Board, BoardTask, BoardTaskList } from '../../../../shared';
import { ChangeTaskData, ChangeTaskListData, TaskComponentData, TaskListManagerComponent, TaskListService, TaskManagerComponent, TaskPopupData, TaskService } from '../../../index';

@Component({
  selector: 'tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export class TasksListComponent {
  @Input({ required: true }) board!: Board;
  @Input({ required: true }) allTaskLists!: BoardTaskList[];
  @Input() taskList: BoardTaskList | undefined;

  constructor(private dialog: MatDialog,
    private taskListService: TaskListService,
    private taskService: TaskService) { }

  onTaskDrop(event: CdkDragDrop<BoardTaskList>) {
    var task: BoardTask = event.item.data;
    task.boardTaskListId = event.container.data.id;
    var changeData = this.createChangeTaskData(task, event.container.data, event.previousContainer.data);
    this.taskService.updateTask(changeData, event.currentIndex);
  }
  openListManagerMenu() {
    const dialogRef = this.dialog.open(TaskListManagerComponent, {
      data: this.taskList
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const isNew = this.taskList == undefined;
        if (isNew)
          this.createNewTaskList(result);
        else {
          this.taskList = result;
          this.updateTaskList();
        }
      }
    });
  }
  openNewTaskManagerMenu() {
    const taskManagerData: TaskPopupData = {
      task: undefined,
      currentTaskList: this.taskList,
      allTaskLists: this.allTaskLists,
      board: this.board
    }
    const dialogRef = this.dialog.open(TaskManagerComponent, {
      data: taskManagerData,
    });
  }
  deleteTaskList() {
    this.taskListService.deleteTaskList(this.createTaskListChangeData(this.taskList!));
  }
  getTaskComponentData() {
    var data: TaskComponentData = {
      currentTaskList: this.taskList!,
      allTaskLists: this.allTaskLists,
      board: this.board
    }
    return data;
  }
  private createNewTaskList(taskList: BoardTaskList) {
    this.taskListService.createNewTaskList(this.createTaskListChangeData(taskList));
  }
  private updateTaskList() {
    this.taskListService.updateTaskList(this.createTaskListChangeData(this.taskList!));
  }
  private createTaskListChangeData(taskList: BoardTaskList) {
    var data: ChangeTaskListData = {
      taskList: taskList,
      allTaskLists: this.allTaskLists,
      board: this.board
    }
    return data;
  }
  private createChangeTaskData(task: BoardTask, currentTaskList: BoardTaskList, prevTaskList: BoardTaskList) {
    var data: ChangeTaskData = {
      task: task,
      currentTaskList: currentTaskList,
      prevTaskList: prevTaskList,
      allTaskLists: this.allTaskLists,
      board: this.board
    }
    return data;
  }
}