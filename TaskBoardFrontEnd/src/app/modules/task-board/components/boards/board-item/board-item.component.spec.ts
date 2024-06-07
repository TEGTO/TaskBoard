import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { DateFormaterService, RedirectorService } from '../../../../shared';
import { BoardService } from '../../../index';
import { BoardItemComponent } from './board-item.component';

describe('BoardItemComponent', () => {
  const mockBoard = { id: '1', userId: '1', name: 'Test Board', creationTime: new Date() };
  const mockBoards = [mockBoard];
  var component: BoardItemComponent;
  var fixture: ComponentFixture<BoardItemComponent>;
  var mockDialog: jasmine.SpyObj<MatDialog>;
  var mockRedirector: jasmine.SpyObj<RedirectorService>;
  var mockBoardService: jasmine.SpyObj<BoardService>;
  var mockDateFormater: jasmine.SpyObj<DateFormaterService>;

  beforeEach(() => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRedirector = jasmine.createSpyObj('RedirectorService', ['redirectToBoard']);
    mockBoardService = jasmine.createSpyObj('BoardService', ['getTaskListsAmountByBoardId', 'getTasksAmountByBoardId', 'deleteBoard', 'createBoard', 'updateBoard']);
    mockDateFormater = jasmine.createSpyObj('DateFormaterService', ['formatDate']);

    TestBed.configureTestingModule({
      declarations: [BoardItemComponent],
      imports: [MatDialogModule, MatMenuModule],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: RedirectorService, useValue: mockRedirector },
        { provide: BoardService, useValue: mockBoardService },
        { provide: DateFormaterService, useValue: mockDateFormater }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardItemComponent);
    component = fixture.componentInstance;
    component.board = mockBoard;
    mockBoardService.getTaskListsAmountByBoardId.and.returnValue(of(5));
    mockBoardService.getTasksAmountByBoardId.and.returnValue(of(10));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize task lists and tasks amount', () => {
    component.ngOnInit();

    expect(mockBoardService.getTaskListsAmountByBoardId).toHaveBeenCalledWith('1');
    expect(mockBoardService.getTasksAmountByBoardId).toHaveBeenCalledWith('1');
    expect(component.taskListsAmount).toBe(5);
    expect(component.tasksAmount).toBe(10);
  });
  it('should format date correctly', () => {
    const formattedDate = '2021-01-01';
    mockDateFormater.formatDate.and.returnValue(formattedDate);

    const result = component.getFormatedDate(new Date());

    expect(mockDateFormater.formatDate).toHaveBeenCalled();
    expect(result).toBe(formattedDate);
  });
  it('should redirect to board on method call', () => {
    component.redirectToBoard();

    expect(mockRedirector.redirectToBoard).toHaveBeenCalledWith('1');
  });
  it('should call deleteBoard on method call', () => {
    component.deleteBoard();

    expect(mockBoardService.deleteBoard).toHaveBeenCalled();
  });
  it('should open dialog on openListManagerMenu call', () => {
    mockDialog.open.and.returnValue({
      afterClosed: () => of(mockBoard)
    } as any);

    component.openListManagerMenu();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockBoardService.updateBoard).toHaveBeenCalled();
  });

  it('should render task list amount and tasks amount', () => {
    fixture.detectChanges();

    const taskListsAmount = fixture.debugElement.query(By.css('.board-list-amount')).nativeElement;
    const tasksAmount = fixture.debugElement.query(By.css('.board-task-amount')).nativeElement;

    expect(taskListsAmount.textContent).toContain('5');
    expect(tasksAmount.textContent).toContain('10');
  });

  it('should render formatted creation time', () => {
    const formattedDate = '2021-01-01';
    mockDateFormater.formatDate.and.returnValue(formattedDate);

    fixture.detectChanges();

    const creationTime = fixture.debugElement.query(By.css('.board-creation-time')).nativeElement;

    expect(creationTime.textContent).toContain(formattedDate);
  });
});