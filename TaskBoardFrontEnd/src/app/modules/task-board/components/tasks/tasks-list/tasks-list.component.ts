import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BoardTask, BoardTaskList } from '../../../../shared';
import { TaskListManagerComponent, TaskListService, TaskListsPopupData, TaskManagerComponent, TaskPopupData, TaskService } from '../../../index';

@Component({
  selector: 'tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export class TasksListComponent {
  @Input({ required: true }) boardId!: string;
  @Input() taskList: BoardTaskList | undefined;

  constructor(private dialog: MatDialog,
    private taskListService: TaskListService,
    private taskService: TaskService) { }

  onTaskDrop(event: CdkDragDrop<BoardTaskList>) {
    var task: BoardTask = {
      ...event.item.data,
      boardTaskListId: event.container.data.id
    };
    this.taskService.updateTask(event.previousContainer.data, task, event.currentIndex);
  }
  openListManagerMenu() {
    const dialogRef = this.dialog.open(TaskListManagerComponent, {
      data: this.getPopupListData()
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const isNew = this.taskList == undefined;
        if (isNew) {
          this.taskListService.createNewTaskList(result);
        }
        else {
          this.taskListService.updateTaskList(result);
        }
      }
    });
  }
  openNewTaskManagerMenu() {
    const taskManagerData: TaskPopupData = {
      task: undefined,
      taskListId: this.taskList?.id!,
      boardId: this.boardId
    }
    const dialogRef = this.dialog.open(TaskManagerComponent, {
      data: taskManagerData,
    });
  }
  deleteTaskList() {
    this.taskListService.deleteTaskList(this.taskList!);
  }
  private getPopupListData() {
    var data: TaskListsPopupData = {
      taskList: this.taskList,
      boardId: this.boardId
    }
    return data;
  }
}