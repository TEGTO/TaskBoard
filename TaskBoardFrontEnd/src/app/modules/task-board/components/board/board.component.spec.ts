import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ActivityHistoryComponent } from '../../../action-history';
import { BoardTaskList, TaskListApiService } from '../../../shared';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  var component: BoardComponent;
  var fixture: ComponentFixture<BoardComponent>;
  var dialog: MatDialog;
  var taskListService: jasmine.SpyObj<TaskListApiService>;
  var mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(waitForAsync(() => {
    taskListService = jasmine.createSpyObj('TaskListApiService', ['getTaskLists']);
    mockDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    taskListService.getTaskLists.and.returnValues(of([]));
    mockDialog.open.and.returnValues();
    TestBed.configureTestingModule({
      declarations: [BoardComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: TaskListApiService, useValue: taskListService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    dialog = TestBed.inject(MatDialog);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render board name', () => {
    const boardNameElement: HTMLElement = fixture.debugElement.query(By.css('.board-name')).nativeElement;
    expect(boardNameElement.textContent).toContain('My Task Board');
  });
  it('should open history dialog', () => {
    const historyButton: HTMLElement = fixture.debugElement.query(By.css('button[class="history-menu"]')).nativeElement;
    historyButton.click();
    fixture.detectChanges();
    expect(mockDialog.open).toHaveBeenCalledWith(ActivityHistoryComponent);
  });
  it('should load task lists on initialization', () => {
    expect(taskListService.getTaskLists).toHaveBeenCalled();
  });
  it('should open history bar dialog when history button is clicked', () => {
    const historyButton = fixture.debugElement.query(By.css('button[class=history-menu]'));
    historyButton.nativeElement.click();

    expect(dialog.open).toHaveBeenCalledOnceWith(ActivityHistoryComponent);
  });
  it('should render task lists when taskLists are available', () => {
    const taskList: BoardTaskList = { id: 'list_id', userId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    const taskLists: BoardTaskList[] = [taskList, taskList];
    component.taskLists = taskLists;
    fixture.detectChanges();

    const taskListElements = fixture.debugElement.queryAll(By.css('tasks-list[class="board-column"]'));
    expect(taskListElements.length).toEqual(taskLists.length + 1);

    taskListElements.forEach((taskListElement, index) => {
      const taskListComponent = taskListElement.componentInstance;
      if (taskListComponent.taskList) {
        expect(taskListComponent.taskList).toEqual(taskLists[index]);
        expect(taskListComponent.allTaskLists).toEqual(taskLists);
      }
    });
  });

});
