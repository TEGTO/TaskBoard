import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Priority } from '../../../shared/enums/priority.enum';
import { BoardTaskList } from '../../../shared/models/board-task-list.model';
import { BoardTask, copyTaskValues, getDefaultBoardTask } from '../../../shared/models/board-task.model';
import { PriorityConvertorService } from '../../../shared/services/priority-convertor/priority-convertor.service';
import { CustromValidatorsService } from '../../services/custom-validators/custrom-validators.service';
import { TaskService } from '../../services/task-service/task.service';
import { TaskPopupData } from '../util/task-popup-data';

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
  private task!: BoardTask;
  private currentTaskList: BoardTaskList | undefined;
  private isNew: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: TaskPopupData,
    private formBuilder: FormBuilder, private dialogRef: MatDialogRef<TaskManagerComponent>,
    private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.currentTaskList = this.data.currentTaskList;
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
    const firstListId = this.currentTaskList ? this.currentTaskList.id : "";
    this.taskForm = this.formBuilder.group({
      name: [this.task?.name || '', Validators.required],
      listId: [this.task?.boardTaskListId || firstListId, Validators.required],
      dueDate: [this.task?.dueTime || new Date(), [Validators.required, CustromValidatorsService.dateMinimum(new Date())]],
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
    this.taskService.updateTask(this.task, this.taskLists, this.currentTaskList);
  }
}
