import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Board } from '../../../../shared';
import { BoardManagerComponent } from './board-manager.component';

describe('BoardManagerComponent', () => {
  const mockBoard: Board = { id: '1', userId: "userId", creationTime: new Date(), name: 'Board 1' }
  var component: BoardManagerComponent;
  var fixture: ComponentFixture<BoardManagerComponent>;
  var dialogRef: jasmine.SpyObj<MatDialogRef<BoardManagerComponent>>;
  var mockDialog: jasmine.SpyObj<MatDialog>;
  var formBuilder: FormBuilder;
  var debugEl: DebugElement;

  beforeEach(waitForAsync(() => {
    dialogRef = jasmine.createSpyObj<MatDialogRef<BoardManagerComponent>>('MatDialogRef', ['close']);
    mockDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    formBuilder = new FormBuilder();

    TestBed.configureTestingModule({
      declarations: [BoardManagerComponent],
      imports: [ReactiveFormsModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockBoard },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MatDialog, useValue: mockDialog },
        { provide: FormBuilder, useValue: formBuilder }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardManagerComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with correct card name', () => {
    expect(component.boardFormGroup).toBeTruthy();
    expect(component.cardName).toBe('Edit Board');
  });
  it('should initialize form with board data', () => {
    expect(component.boardFormGroup.get('name')?.value).toBe(mockBoard.name);
  });
  it('should render correct', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const header: HTMLElement = debugEl.query(By.css('.manager-header')).nativeElement;
    const inputElement = debugEl.query(By.css('#input-name')).nativeElement;
    expect(header.textContent).toEqual('Edit Board');
    expect(component.boardFormGroup.get('name')?.value).toBe(mockBoard.name);
    expect(inputElement.value).toBe(mockBoard.name);
  });
  it('should show error message if name is invalid', () => {
    component.boardFormGroup.get('name')?.setValue('');
    component.boardFormGroup.get('name')?.markAsDirty();
    component.updateView();
    fixture.detectChanges();
    const errorMessage = debugEl.query(By.css('.message.is-danger'));
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.textContent).toContain('Please enter board name');
  });
  it('should disable save button if form is invalid', () => {
    component.boardFormGroup.get('name')?.setValue('');
    component.updateView();
    fixture.detectChanges();
    const saveButton = debugEl.query(By.css('button[type="submit"]'));
    expect(saveButton.nativeElement.disabled).toBeTruthy();
  });
  it('should enable save button if form is valid', () => {
    component.boardFormGroup.get('name')?.setValue('Valid List Name');
    fixture.detectChanges();
    const saveButton = debugEl.query(By.css('button[type="submit"]'));
    expect(saveButton.nativeElement.disabled).toBeFalsy();
  });
  it('should call onSubmit method when form is submitted', () => {
    spyOn(component, 'onSubmit').and.callThrough();
    component.boardFormGroup.get('name')?.setValue('Valid Board Name');
    const form = debugEl.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });
  it('should close dialog with updated board when form is valid', () => {
    component.boardFormGroup.get('name')?.setValue('Updated Board Name');
    component.onSubmit();
    expect(dialogRef.close).toHaveBeenCalledWith({ ...mockBoard, name: 'Updated Board Name' });
  });
  it('should not close dialog if form is invalid', () => {
    component.boardFormGroup.get('name')?.setValue('');
    component.onSubmit();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
