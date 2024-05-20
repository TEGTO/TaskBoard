import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BoardTaskList } from '../../../../shared';
import { TaskListManagerComponent } from './task-list-manager.component';

describe('TaskListManagerComponent', () => {
  const mockTaskList: BoardTaskList = { id: 'list_id', userId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
  var component: TaskListManagerComponent;
  var fixture: ComponentFixture<TaskListManagerComponent>;
  var dialogRef: jasmine.SpyObj<MatDialogRef<TaskListManagerComponent>>;
  var mockDialog: jasmine.SpyObj<MatDialog>;
  var formBuilder: FormBuilder;
  var debugEl: DebugElement;

  beforeEach(waitForAsync(() => {
    dialogRef = jasmine.createSpyObj<MatDialogRef<TaskListManagerComponent>>('MatDialogRef', ['close']);
    mockDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    formBuilder = new FormBuilder();

    TestBed.configureTestingModule({
      declarations: [TaskListManagerComponent],
      imports: [ReactiveFormsModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockTaskList },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MatDialog, useValue: mockDialog },
        { provide: FormBuilder, useValue: formBuilder }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListManagerComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with correct card name', () => {
    expect(component.taskListForm).toBeTruthy();
    expect(component.cardName).toBe('Edit List');
  });
  it('should initialize form with task list data', () => {
    expect(component.taskListForm.get('name')?.value).toBe(mockTaskList.name);
  });
  it('should render correct', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const header: HTMLElement = debugEl.query(By.css('.manager-header')).nativeElement;
    const inputElement = debugEl.query(By.css('#input-name')).nativeElement;
    expect(header.textContent).toEqual('Edit List');
    expect(component.taskListForm.get('name')?.value).toBe(mockTaskList.name);
    expect(inputElement.value).toBe(mockTaskList.name);
  });
  it('should show error message if name is invalid', () => {
    component.taskListForm.get('name')?.setValue('');
    component.taskListForm.get('name')?.markAsDirty();
    fixture.detectChanges();
    const errorMessage = debugEl.query(By.css('.message.is-danger'));
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.textContent).toContain('Please enter list name');
  });
  it('should disable save button if form is invalid', () => {
    component.taskListForm.get('name')?.setValue('');
    fixture.detectChanges();
    const saveButton = debugEl.query(By.css('button[type="submit"]'));
    expect(saveButton.nativeElement.disabled).toBeTruthy();
  });
  it('should enable save button if form is valid', () => {
    component.taskListForm.get('name')?.setValue('Valid List Name');
    fixture.detectChanges();
    const saveButton = debugEl.query(By.css('button[type="submit"]'));
    expect(saveButton.nativeElement.disabled).toBeFalsy();
  });
  it('should call onSubmit method when form is submitted', () => {
    spyOn(component, 'onSubmit').and.callThrough();
    component.taskListForm.get('name')?.setValue('Valid List Name');
    const form = debugEl.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });
  it('should close dialog with updated task list when form is valid', () => {
    component.taskListForm.get('name')?.setValue('Updated List Name');
    component.onSubmit();
    expect(dialogRef.close).toHaveBeenCalledWith({ ...mockTaskList, name: 'Updated List Name' });
  });
  it('should not close dialog if form is invalid', () => {
    component.taskListForm.get('name')?.setValue('');
    component.onSubmit();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
