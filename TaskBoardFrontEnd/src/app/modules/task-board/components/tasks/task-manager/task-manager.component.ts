import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoardTask, BoardTaskList, DateValidator, Priority, PriorityConvertorService, getDefaultBoardTask } from '../../../../shared';
import { TaskListService, TaskPopupData, TaskService } from '../../../index';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskManagerComponent implements OnInit {
  taskForm!: FormGroup;
  cardName!: string;
  minDate!: Date;
  isNewTask!: boolean;
  allTaskLists!: BoardTaskList[];
  private task!: BoardTask;

  constructor(@Inject(MAT_DIALOG_DATA) private data: TaskPopupData,
    private taskListService: TaskListService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TaskManagerComponent>,
    private taskService: TaskService,
    private dateValidator: DateValidator) {
  }

  ngOnInit(): void {
    this.isNewTask = this.data.task == undefined;
    this.cardName = this.isNewTask ? "Create Task" : "Edit Task";
    this.setMinDate();
    this.getTaskLists();
    this.assignTask();
    this.initForm();
  }
  getAllPriorityNames() {
    return PriorityConvertorService.getAllPrioritiesString()
  }
  onSubmit(): void {
    if (this.taskForm.valid) {
      var taskInForm = this.getTaskFromForm();
      if (this.isNewTask)
        this.createNewTask(taskInForm);
      else
        this.updateTask(taskInForm);
      this.dialogRef.close(taskInForm);
    }
  }
  isDateInvalid() {
    return this.taskForm.get("dueDate")?.invalid && this.taskForm.get("dueDate")?.dirty;
  }
  isNameInvalid() {
    return this.taskForm.get("name")?.invalid && (this.taskForm.get("name")?.dirty || this.taskForm.get("name")?.touched);
  }
  private setMinDate() {
    var date = this.isNewTask ? new Date() : this.data.task?.dueTime ?? new Date();
    this.minDate = date;
  }
  private getTaskLists() {
    this.taskListService.getTaskListsByBoardId(this.data.boardId).subscribe((lists) => { this.allTaskLists = lists });
  }
  private assignTask() {
    this.task = this.data.task ? this.data.task : getDefaultBoardTask();
  }
  private initForm(): void {
    const firstListId = this.allTaskLists.length > 0 ? this.allTaskLists[0] : "";
    this.taskForm = this.formBuilder.group({
      name: [this.task?.name || '', Validators.required],
      listId: [this.task?.boardTaskListId || firstListId, Validators.required],
      dueDate: [this.task?.dueTime || new Date(), [Validators.required, this.dateValidator.dateMinimum(this.minDate)]],
      priority: [this.task?.priority || Priority.Low, [Validators.required]],
      description: [this.task?.description || ""]
    });
  }
  private getTaskFromForm() {
    const formValue = this.taskForm.value;
    const buffer = {
      ...this.task,
      name: formValue.name,
      boardTaskListId: formValue.listId,
      dueTime: formValue.dueDate,
      priority: formValue.priority,
      description: formValue.description,
    };
    return buffer;
  }
  private createNewTask(task: BoardTask) {
    this.taskService.createTask({ ...task, boardTaskListId: this.data.taskListId });
  }
  private updateTask(task: BoardTask) {
    this.taskListService.getTaskListById(this.task.boardTaskListId).subscribe(
      (list) => {
        if (list) {
          var currentTaskList = this.allTaskLists.find(x => x.id == task.boardTaskListId)!;
          var newIndex = currentTaskList.id == task.boardTaskListId ? list.boardTasks.findIndex((element) => element.id === this.task.id) : 0;
          this.taskService.updateTask(list, task, newIndex);
        }
      }
    );
  }
}