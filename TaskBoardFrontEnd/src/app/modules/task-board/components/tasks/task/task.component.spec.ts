import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BoardTask, DATE_CONFIG, DateFormaterService, Priority, StandartDateFormaterService } from '../../../../shared';
import { TaskInfoComponent, TaskManagerComponent, TaskService } from '../../../index';
import { TaskComponent } from './task.component';

describe('TaskComponent', () => {
  const mockTask: BoardTask = { id: 'task_id', name: 'task', boardTaskListId: 'list_id', creationTime: new Date(), dueTime: new Date(), priority: Priority.Low, description: 'desc' };
  var component: TaskComponent;
  var fixture: ComponentFixture<TaskComponent>;
  var dialog: MatDialog;
  var mockTaskService: jasmine.SpyObj<TaskService>;
  var mockDialog: jasmine.SpyObj<MatDialog>;
  var debugEl: DebugElement;

  beforeEach(waitForAsync(() => {
    mockDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    mockTaskService = jasmine.createSpyObj('TaskService', ['deleteTask']);
    mockDialog.open.and.returnValues();
    TestBed.configureTestingModule({
      declarations: [TaskComponent],
      imports: [MatDialogModule, MatMenuModule],
      providers: [
        DateFormaterService,
        { provide: DATE_CONFIG, useValue: { format: 'EEE, d MMM YYYY' } },
        { provide: DateFormaterService, useClass: StandartDateFormaterService },
        { provide: TaskService, useValue: mockTaskService },
        { provide: MatDialog, useValue: mockDialog },
        provideAnimationsAsync()
      ]
    }).compileComponents();
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(TaskComponent);
    debugEl = fixture.debugElement;
    component = fixture.componentInstance;
    component.task = mockTask;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render task details', () => {
    fixture.detectChanges();
    const taskNameElement: HTMLElement = debugEl.query(By.css('.task-header-text')).nativeElement;
    expect(taskNameElement.textContent).toEqual(mockTask.name!);

    const taskDescriptionElement: HTMLElement = fixture.nativeElement.querySelector('.task-description');
    expect(taskDescriptionElement.textContent).toEqual(mockTask.description!);

    const taskDateElement: HTMLElement = fixture.nativeElement.querySelector('.task-date');
    expect(taskDateElement.textContent).toContain(component.getFormatedDate(mockTask.dueTime));

    const taskPriorityElement: HTMLElement = fixture.nativeElement.querySelector('.task-priority');
    expect(taskPriorityElement.textContent).toContain(component.getPriorityString(mockTask.priority));
  });
  it('should call openInfoMenu method when info menu button is clicked', () => {
    const menuButton = debugEl.queryAll(By.css('button'))[0].nativeElement;
    menuButton.click();
    const infoButton: HTMLElement = debugEl.queryAll(By.css('button'))[1].nativeElement;
    infoButton.click();
    fixture.detectChanges();
    expect(mockDialog.open).toHaveBeenCalledWith(TaskInfoComponent, jasmine.any(Object));
  });
  it('should call openEditMenu method when edit menu button is clicked', () => {
    const menuButton = debugEl.queryAll(By.css('button'))[0].nativeElement;
    menuButton.click();
    const editButton: HTMLElement = debugEl.queryAll(By.css('button'))[2].nativeElement;
    editButton.click();
    fixture.detectChanges();
    expect(mockDialog.open).toHaveBeenCalledWith(TaskManagerComponent, jasmine.any(Object));
  });
  it('should call deleteButton method when delete button is clicked', () => {
    const menuButton = debugEl.queryAll(By.css('button'))[0].nativeElement;
    menuButton.click();
    const deleteButton: HTMLElement = debugEl.queryAll(By.css('button'))[3].nativeElement;
    deleteButton.click();
    fixture.detectChanges();
    expect(mockTaskService.deleteTask).toHaveBeenCalledWith(mockTask);
  });
});