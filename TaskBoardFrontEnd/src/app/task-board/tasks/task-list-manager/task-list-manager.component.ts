import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoardTaskList, copyTaskListValues, getDefaultBoardTaskList } from '../../shared/models/board-task-list.model';

@Component({
  selector: 'app-task-list-manager',
  templateUrl: './task-list-manager.component.html',
  styleUrl: './task-list-manager.component.scss'
})
export class TaskListManagerComponent implements OnInit {
  taskListForm!: FormGroup;
  cardName: string = "";
  private taskList!: BoardTaskList;

  constructor(@Inject(MAT_DIALOG_DATA) public data: BoardTaskList,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TaskListManagerComponent>) { }

  ngOnInit(): void {
    this.cardName = this.taskList ? "Edit List" : "Create List";
    this.assignTaskList();
    this.initForm();
  }
  isNameInvalid() {
    return this.taskListForm.get("name")?.invalid && this.taskListForm.get("name")?.dirty;
  }
  onSubmit(): void {
    if (this.taskListForm.valid) {
      this.getDataFromForm();
      this.dialogRef.close(this.taskList);
    }
  }
  private assignTaskList() {
    this.taskList = this.data ? this.data : getDefaultBoardTaskList();
  }
  private initForm(): void {
    this.taskListForm = this.formBuilder.group({
      name: [this.taskList?.name || '', Validators.required]
    });
  }
  private getDataFromForm() {
    const formValue = this.taskListForm.value;
    const buffer = { ...this.taskList, name: formValue.name };
    copyTaskListValues(this.taskList, buffer)
  }
}
