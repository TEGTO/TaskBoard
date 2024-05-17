import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoardTask, BoardTaskList, DateValidator, Priority, PriorityConvertorService, copyTaskValues, getDefaultBoardTask } from '../../../../shared';
import { TaskPopupData, TaskService } from '../../../index';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent implements OnInit {
  taskForm!: FormGroup;
  cardName: string = "";
  minDate = new Date();
  taskLists!: BoardTaskList[];
  isNew: boolean = false;
  private task!: BoardTask;
  private taskList!: BoardTaskList;

  constructor(@Inject(MAT_DIALOG_DATA) private data: TaskPopupData,
    private formBuilder: FormBuilder, private dialogRef: MatDialogRef<TaskManagerComponent>,
    private taskService: TaskService, private dateValidator: DateValidator) {
  }

  ngOnInit(): void {
    this.taskList = this.data.currentTaskList!;
    this.cardName = this.data.task ? "Edit Task" : "Create Task";
    this.isNew = this.data.task == undefined;
    this.getTaskLists();
    this.assignTask();
    this.initForm();
  }
  getAllPriorityNames() {
    return PriorityConvertorService.getAllPrioritiesString()
  }
  onSubmit(): void {
    if (this.taskForm.valid) {
      this.getTaskFromForm();
      if (this.isNew)
        this.createNewTask();
      else
        this.updateTask();
      this.dialogRef.close(this.task);
    }
  }
  isDateInvalid() {
    return this.taskForm.get("dueDate")?.invalid && this.taskForm.get("dueDate")?.dirty;
  }
  isNameInvalid() {
    return this.taskForm.get("name")?.invalid && (this.taskForm.get("name")?.dirty || this.taskForm.get("name")?.touched);
  }
  private getTaskLists() {
    this.taskLists = this.data.allTaskLists ? this.data.allTaskLists : [];
  }
  private assignTask() {
    this.task = this.data.task ? this.data.task : getDefaultBoardTask();
  }
  private initForm(): void {
    const firstListId = this.taskList ? this.taskList.id : "";
    this.taskForm = this.formBuilder.group({
      name: [this.task?.name || '', Validators.required],
      listId: [this.task?.boardTaskListId || firstListId, Validators.required],
      dueDate: [this.task?.dueTime || new Date(), [Validators.required, this.dateValidator.dateMinimum(new Date())]],
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
    copyTaskValues(this.task, buffer);
  }
  private createNewTask() {
    this.taskService.createNewTask(this.task, this.taskLists);
  }
  private updateTask() {
    var newIndex = 0;
    var currentTaskList = this.taskLists.find(x => x.id == this.task.boardTaskListId)!;
    if (currentTaskList.id == this.taskList.id)
      newIndex = this.taskList.boardTasks.findIndex((element) => element.id === this.task.id)
    this.taskService.updateTask(this.task, this.taskList, currentTaskList, newIndex);
  }
}