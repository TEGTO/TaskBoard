import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoardTaskList, getDefaultBoardTaskList } from '../../../../shared';
import { TaskListsPopupData } from '../../../index';

/**The component for editing/creating a task list.*/
@Component({
  selector: 'app-task-list-manager',
  templateUrl: './task-list-manager.component.html',
  styleUrl: './task-list-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListManagerComponent implements OnInit {
  taskListForm!: FormGroup;
  cardName: string = "";
  private taskList!: BoardTaskList;

  constructor(@Inject(MAT_DIALOG_DATA) public data: TaskListsPopupData,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TaskListManagerComponent>,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cardName = this.data.taskList ? "Edit List" : "Create List";
    this.assignTaskList();
    this.initForm();
  }
  onSubmit(): void {
    if (this.taskListForm.valid) {
      var taskListFromForm = this.getDataFromForm();
      this.dialogRef.close(taskListFromForm);
    }
  }
  isNameInvalid() {
    return this.taskListForm.get("name")?.invalid && this.taskListForm.get("name")?.dirty;
  }
  updateView() {
    this.cdr.markForCheck();
  }
  private assignTaskList() {
    this.taskList = this.data.taskList ? this.data.taskList : getDefaultBoardTaskList();
  }
  private initForm(): void {
    this.taskListForm = this.formBuilder.group({
      name: [this.taskList?.name || '', Validators.required]
    });
  }
  private getDataFromForm() {
    const formValue = this.taskListForm.value;
    const buffer = { ...this.taskList, name: formValue.name, boardId: this.data.boardId };
    return buffer;
  }
}
