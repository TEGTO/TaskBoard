import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { BoardTask, BoardTaskList, DateValidator, Priority, PriorityConvertorService } from '../../../../shared';
import { TaskService } from '../../../services/task-service/task-service';
import { TaskPopupData } from '../../../util/task-popup-data';
import { TaskManagerComponent } from './task-manager.component';

describe('TaskManagerComponent', () => {
  const mockTask: BoardTask = {
    id: '1',
    name: 'Test Task',
    boardTaskListId: '1',
    dueTime: new Date(),
    creationTime: new Date(),
    priority: Priority.Low,
    description: 'Test Description'
  };
  const mockTaskList: BoardTaskList = { id: '1', boardId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [mockTask] }
  const mockData: TaskPopupData = {
    currentTaskList: mockTaskList,
    task: mockTask,
    allTaskLists: [mockTaskList]
  };
  var component: TaskManagerComponent;
  var fixture: ComponentFixture<TaskManagerComponent>;
  var dialogRef: jasmine.SpyObj<MatDialogRef<TaskManagerComponent>>;
  var mockDialog: jasmine.SpyObj<MatDialog>;
  var taskService: jasmine.SpyObj<TaskService>;
  var dateValidator: jasmine.SpyObj<DateValidator>;
  var debugEl: DebugElement;

  beforeEach(waitForAsync(() => {
    dialogRef = jasmine.createSpyObj<MatDialogRef<TaskManagerComponent>>('MatDialogRef', ['close']);
    mockDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    taskService = jasmine.createSpyObj<TaskService>('TaskService', ['createNewTask', 'updateTask']);
    dateValidator = jasmine.createSpyObj<DateValidator>('DateValidator', ['dateMinimum']);
    dateValidator.dateMinimum.and.returnValue(() => null as unknown as ValidatorFn);
    TestBed.configureTestingModule({
      declarations: [TaskManagerComponent],
      imports: [ReactiveFormsModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule],
      providers: [
        PriorityConvertorService,
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MatDialog, useValue: mockDialog },
        { provide: TaskService, useValue: taskService },
        { provide: DateValidator, useValue: dateValidator },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with correct card name', () => {
    expect(component.cardName).toBe('Edit Task');
  });
  it('should render all elements correctly', () => {
    const header = debugEl.query(By.css('.task-manager-header')).nativeElement;
    expect(header.textContent).toContain('Edit Task');
    const taskNameInput = debugEl.query(By.css('#input-name')).nativeElement;
    expect(taskNameInput.placeholder).toBe('Task name');
    expect(taskNameInput.value).toBe(mockTask.name);
    const listSelect = debugEl.query(By.css('mat-select[formControlName="listId"]')).nativeElement;
    expect(listSelect).toBeTruthy();
    const dataPicker = debugEl.query(By.css('input[formControlName="dueDate"]')).nativeElement;
    expect(dataPicker).toBeTruthy();
    const expectedDate = new Intl.DateTimeFormat('en-US').format(new Date(mockTask.dueTime!));
    expect(dataPicker.value).toEqual(expectedDate);
    const description = debugEl.query(By.css('textarea[formControlName="description"]')).nativeElement;
    expect(description).toBeTruthy();
    expect(description.value).toEqual(mockTask.description);
  });
  it('should initialize form with task data', () => {
    expect(component.taskForm.get('name')?.value).toBe(mockTask.name);
    expect(component.taskForm.get('listId')?.value).toBe(mockTask.boardTaskListId);
    expect(component.taskForm.get('dueDate')?.value).toEqual(mockTask.dueTime);
    expect(component.taskForm.get('priority')?.value).toBe(mockTask.priority);
    expect(component.taskForm.get('description')?.value).toBe(mockTask.description);
  });
  it('should bind input value to task name', () => {
    const inputElement = debugEl.query(By.css('#input-name')).nativeElement;
    expect(inputElement.value).toBe(mockTask.name);
  });

  it('should show error message if name is invalid', () => {
    component.taskForm.get('name')?.setValue('');
    component.taskForm.get('name')?.markAsDirty();
    fixture.detectChanges();
    const errorMessage = debugEl.query(By.css('.help.is-danger'));
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.textContent).toContain('Please enter task name');
  });
  it('should disable save button if form is invalid', () => {
    component.taskForm.get('name')?.setValue('');
    fixture.detectChanges();
    const saveButton = debugEl.query(By.css('button[type="submit"]'));
    expect(saveButton.nativeElement.disabled).toBeTruthy();
  });
  it('should enable save button if form is valid', () => {
    component.taskForm.get('name')?.setValue('Valid Task Name');
    fixture.detectChanges();
    const saveButton = debugEl.query(By.css('button[type="submit"]'));
    expect(saveButton.nativeElement.disabled).toBeFalsy();
  });
  it('should call onSubmit method when form is submitted', () => {
    spyOn(component, 'onSubmit').and.callThrough();
    component.taskForm.get('name')?.setValue('Valid Task Name');
    const form = debugEl.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should close dialog with updated task when form is valid', () => {
    component.taskForm.get('name')?.setValue('Updated Task Name');
    component.onSubmit();
    expect(dialogRef.close).toHaveBeenCalledWith({ ...mockTask, name: 'Updated Task Name' });
  });

  it('should not close dialog if form is invalid', () => {
    component.taskForm.get('name')?.setValue('');
    component.onSubmit();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should call createNewTask when creating a new task', () => {
    component.isNew = true;
    component.taskForm.get('name')?.setValue('New Task Name');
    component.onSubmit();
    expect(taskService.createNewTask).toHaveBeenCalled();
  });
  it('should call updateTask when updating an existing task', () => {
    component.isNew = false;
    component.taskForm.get('name')?.setValue('Updated Task Name');
    component.onSubmit();
    expect(taskService.updateTask).toHaveBeenCalled();
  });
});
