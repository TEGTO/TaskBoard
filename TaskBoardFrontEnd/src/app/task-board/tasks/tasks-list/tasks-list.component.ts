import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskListService } from '../../services/task-list-service/task-list.service';
import { TaskService } from '../../services/task-service/task.service';
import { BoardTaskList } from '../../shared/models/board-task-list.model';
import { BoardTask } from '../../shared/models/board-task.model';
import { TaskListManagerComponent } from '../task-list-manager/task-list-manager.component';
import { TaskManagerComponent } from '../task-manager/task-manager.component';
import { TaskPopupData } from '../util/task-popup-data';

@Component({
  selector: 'tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export class TasksListComponent {
  @Input({ required: true }) allTaskLists!: BoardTaskList[];
  @Input() taskList: BoardTaskList | undefined;

  constructor(private dialog: MatDialog,
    private taskListService: TaskListService,
    private taskService: TaskService
  ) { }

  onTaskDrop(event: CdkDragDrop<BoardTaskList>) {
    var task: BoardTask = event.item.data;
    task.boardTaskListId = event.container.data.id;
    this.taskService.updateTask(task, event.previousContainer.data,
      event.container.data, event.currentIndex);
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
      allTaskLists: this.allTaskLists
    }
    const dialogRef = this.dialog.open(TaskManagerComponent, {
      data: taskManagerData,
    });
  }
  deleteTaskList() {
    this.taskListService.deleteTaskList(this.taskList, this.allTaskLists);
  }
  private createNewTaskList(taskList: BoardTaskList) {
    this.taskListService.createNewTaskList(taskList, this.allTaskLists);
  }
  private updateTaskList() {
    this.taskListService.updateTaskList(this.taskList);
  }
}