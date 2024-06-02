import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Board, getDefaultBoard } from '../../../../shared';

@Component({
  selector: 'app-board-manager',
  templateUrl: './board-manager.component.html',
  styleUrl: './board-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardManagerComponent {
  boardFormGroup!: FormGroup;
  cardName: string = "";
  private board!: Board;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Board,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<BoardManagerComponent>,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cardName = this.data ? "Edit Board" : "Create Board";
    this.assignBoard();
    this.initForm();
  }
  updateView() {
    this.cdr.markForCheck();
  }
  onSubmit(): void {
    if (this.boardFormGroup.valid) {
      var boardFromForm = this.getDataFromForm();
      this.dialogRef.close(boardFromForm);
    }
  }
  isNameInvalid() {
    return this.boardFormGroup.get("name")?.invalid && this.boardFormGroup.get("name")?.dirty;
  }
  private assignBoard() {
    this.board = this.data ? this.data : getDefaultBoard();
  }
  private initForm(): void {
    this.boardFormGroup = this.formBuilder.group({
      name: [this.board?.name || '', Validators.required]
    });
  }
  private getDataFromForm() {
    const formValue = this.boardFormGroup.value;
    const buffer = { ...this.board, name: formValue.name };
    return buffer;
  }
}