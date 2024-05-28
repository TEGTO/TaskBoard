import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Board, BoardTaskList, RedirectorService, TaskListApiService } from '../../../../shared';
import { BoardService } from '../../../index';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  const mockBoard: Board = { id: "1", userId: "1", creationTime: new Date, name: "Board1", };
  const mockBoards: Board[] = [mockBoard, { id: "2", userId: "1", creationTime: new Date, name: "Board2", }];
  const mockActivatedRoute = { params: of({ boardId: mockBoard.id }) };
  var component: BoardComponent;
  var fixture: ComponentFixture<BoardComponent>;
  var dialog: MatDialog;
  var mockBoardService: jasmine.SpyObj<BoardService>;
  var mockTaskListService: jasmine.SpyObj<TaskListApiService>;
  var mockDialog: jasmine.SpyObj<MatDialog>;
  var mockRedirector: jasmine.SpyObj<RedirectorService>;

  beforeEach(waitForAsync(() => {
    mockTaskListService = jasmine.createSpyObj<TaskListApiService>('TaskListApiService', ['getTaskListsByBoardId']);
    mockBoardService = jasmine.createSpyObj<BoardService>('BoardService', ['getBoardsByUserId', 'getBoardById']);
    mockRedirector = jasmine.createSpyObj<RedirectorService>('RedirectorService', ['redirectToBoard']);
    mockBoardService.getBoardById.and.returnValue(of(mockBoard));
    mockBoardService.getBoardsByUserId.and.returnValue(of(mockBoards));
    mockDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    mockTaskListService.getTaskListsByBoardId.and.returnValues(of([]));
    var board: Board = { id: "", userId: "", creationTime: new Date() };
    mockBoardService.getBoardById.and.returnValues(of(board));
    mockDialog.open.and.returnValues();
    TestBed.configureTestingModule({
      declarations: [BoardComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: BoardService, useValue: mockBoardService },
        { provide: TaskListApiService, useValue: mockTaskListService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: RedirectorService, useValue: mockRedirector }
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
  it('should capture boardId from route params', () => {
    expect(component.boardId).toBe(mockBoard.id);
  });
  it('should render board name', () => {
    const boardNameElement: HTMLElement = fixture.debugElement.query(By.css('.board-name')).nativeElement;
    expect(boardNameElement.textContent).toContain(mockBoard.name);
  });
  it('should render board dropdown', () => {
    const boards = fixture.debugElement.queryAll(By.css('mat-option'));
    expect(boards.length).toBe(mockBoards.length);
    expect(boards[0].nativeElement.textContent).toContain(mockBoards[0].name);
  });
  it('should open history dialog', () => {
    const historyButton: HTMLElement = fixture.debugElement.query(By.css('button[class="history-menu"]')).nativeElement;
    historyButton.click();
    fixture.detectChanges();
    expect(mockDialog.open).toHaveBeenCalled();
  });
  it('should redirect', () => {
    component.changeBoard();
    expect(mockRedirector.redirectToBoard).toHaveBeenCalledWith(mockBoard.id);
  });
  it('should redirect on click', () => {
    fixture.debugElement.query(By.css('mat-select')).triggerEventHandler('selectionChange');
    expect(mockRedirector.redirectToBoard).toHaveBeenCalled();
  });
  it('should load task lists on initialization', () => {
    expect(mockTaskListService.getTaskListsByBoardId).toHaveBeenCalled();
  });
  it('should open history bar dialog when history button is clicked', () => {
    const historyButton = fixture.debugElement.query(By.css('button[class=history-menu]'));
    historyButton.nativeElement.click();

    expect(mockBoardService.getBoardById).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalled();
  });
  it('should render task lists when taskLists are available', () => {
    const taskList: BoardTaskList = { id: 'list_id', boardId: "userId", creationTime: new Date(), name: 'List 1', boardTasks: [] }
    const taskLists: BoardTaskList[] = [taskList, taskList];
    component.taskLists$ = of(taskLists);
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
