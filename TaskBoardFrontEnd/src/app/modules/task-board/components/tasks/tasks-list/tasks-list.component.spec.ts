import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of } from 'rxjs';
import { BoardTaskList } from '../../../../shared';
import { TaskListManagerComponent, TaskListService, TaskManagerComponent, TasksListComponent } from '../../../index';

describe('TasksListComponent', () => {
  const mockTaskList: BoardTaskList = { id: '1', userId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
  const mockAllTaskLists: BoardTaskList[] = [mockTaskList]
  var component: TasksListComponent;
  var fixture: ComponentFixture<TasksListComponent>;
  var debugEl: DebugElement;
  var mockDialog: jasmine.SpyObj<MatDialog>;
  var mockTaskListService: jasmine.SpyObj<TaskListService>;

  beforeEach(waitForAsync(() => {
    mockDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    mockTaskListService = jasmine.createSpyObj<TaskListService>('TaskListService', ['createNewTaskList', 'deleteTaskList', 'updateTaskList']);
    TestBed.configureTestingModule({
      imports: [MatMenuModule, CdkDropList, CdkDrag],
      declarations: [TasksListComponent, TaskManagerComponent, TaskListManagerComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: TaskListService, useValue: mockTaskListService },
        provideAnimationsAsync()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TasksListComponent);
    debugEl = fixture.debugElement;
    component = fixture.componentInstance;
    component.taskList = mockTaskList;
    fixture.detectChanges();
  });

  it('should render task list correctly', () => {
    const taskList: BoardTaskList = {
      id: '1',
      userId: '1',
      creationTime: new Date(),
      name: 'Test List',
      boardTasks: [
        { id: '1', boardTaskListId: '1', creationTime: new Date(), priority: 0 },
        { id: '2', boardTaskListId: '1', creationTime: new Date(), priority: 1 }
      ]
    };

    component.taskList = taskList;
    fixture.detectChanges();

    const headerTitleElement = debugEl.query(By.css('.header-title-text'));
    expect(headerTitleElement.nativeElement.textContent).toContain(taskList.name);
    const taskCountElement = debugEl.query(By.css('.end-container span'));
    expect(taskCountElement.nativeElement.textContent).toContain(taskList.boardTasks.length);
    // Check rendering of individual tasks
    const taskElements = debugEl.queryAll(By.css('.task-box'));
    expect(taskElements.length).toBe(taskList.boardTasks.length);
    taskElements.forEach((taskElement, index) => {
      const task = taskList.boardTasks[index];
      expect(taskElement.nativeNode.task).toEqual(task);
    });
  });
  it('should render task count correctly', () => {
    const taskList: BoardTaskList = {
      id: '1',
      userId: '1',
      creationTime: new Date(),
      name: 'Test List',
      boardTasks: [
        { id: '1', boardTaskListId: '1', creationTime: new Date(), priority: 0 },
        { id: '2', boardTaskListId: '1', creationTime: new Date(), priority: 1 }
      ]
    };

    component.taskList = taskList;
    fixture.detectChanges();

    const taskCountElement = debugEl.query(By.css('.end-container span'));
    expect(taskCountElement.nativeElement.textContent).toContain(taskList.boardTasks.length);
  });
  it('should open task manager dialog when "Add New Card" button is clicked', () => {
    component.allTaskLists = mockAllTaskLists;
    component.taskList = mockTaskList;
    const newCardButton = debugEl.query(By.css('.new-card-button'));

    newCardButton.nativeElement.click();

    expect(mockDialog.open).toHaveBeenCalledWith(TaskManagerComponent, { data: { task: undefined, currentTaskList: mockTaskList, allTaskLists: mockAllTaskLists } });
  });
  it('should open the menu when triggered', () => {
    const menuButton = debugEl.query(By.css('.card-header-icon'));

    menuButton.nativeElement.click();
    fixture.detectChanges();

    const menuElement = debugEl.query(By.css('mat-menu'));
    expect(menuElement).toBeTruthy();
  });
  it('should call openListManagerMenu() when "Edit" button is clicked', () => {
    const menuButton = debugEl.query(By.css('.card-header-icon'));
    menuButton.nativeElement.click();
    fixture.detectChanges();
    spyOn(component, 'openListManagerMenu');
    const editButton = debugEl.query(By.css('button[mat-menu-item]'));

    editButton.nativeElement.click();

    expect(component.openListManagerMenu).toHaveBeenCalled();
  });
  it('should call deleteTaskList() when "Delete" button is clicked', () => {
    const menuButton = debugEl.query(By.css('.card-header-icon'));
    menuButton.nativeElement.click();
    fixture.detectChanges();
    spyOn(component, 'deleteTaskList');

    const deleteButton = debugEl.query(By.css('.has-text-danger'));
    deleteButton.nativeElement.click();

    expect(component.deleteTaskList).toHaveBeenCalled();
  });
  it('should call openNewTaskManagerMenu() when "Add New Card" button is clicked', () => {
    spyOn(component, 'openNewTaskManagerMenu');
    const newTaskButton = debugEl.query(By.css('.new-card-button'));

    newTaskButton.nativeElement.click();

    expect(component.openNewTaskManagerMenu).toHaveBeenCalled();
  });
  it('should render and open openListManagerMenu on clicked', () => {
    component.taskList = undefined;
    fixture.detectChanges();
    spyOn(component, 'openListManagerMenu');
    const menuButton = debugEl.query(By.css('button'));

    menuButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.openListManagerMenu).toHaveBeenCalled();
  });
  it('should call deleteTaskList() of taskListService', () => {
    component.deleteTaskList();
    expect(mockTaskListService.deleteTaskList).toHaveBeenCalled();
  });
  it('should open list manager menu and handle update', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(mockTaskList) });
    dialogRefSpyObj.afterClosed.and.returnValue(of(mockTaskList));
    mockDialog.open.and.returnValue(dialogRefSpyObj);
    component.taskList = { id: 'new list', userId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] };

    component.openListManagerMenu();

    expect(component.taskList).toBe(mockTaskList);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockTaskListService.updateTaskList).toHaveBeenCalled();
  });
  it('should open list manager menu and handle create', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(mockTaskList) });
    dialogRefSpyObj.afterClosed.and.returnValue(of(mockTaskList));
    mockDialog.open.and.returnValue(dialogRefSpyObj);
    component.taskList = undefined;

    component.openListManagerMenu();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockTaskListService.createNewTaskList).toHaveBeenCalled();
  });
});
