import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ActivityService } from '../../../../action-history';
import { BoardTask, BoardTaskActivity, BoardTaskList, DateFormaterService, Priority, PriorityConvertorService } from '../../../../shared';
import { TaskListService } from '../../../services/task-list-service/task-list-service';
import { TaskInfoComponent } from './task-info.component';

describe('TaskInfoComponent', () => {
  var component: TaskInfoComponent;
  var fixture: ComponentFixture<TaskInfoComponent>;
  var debugEl: DebugElement;
  var mockDialog: jasmine.SpyObj<MatDialog>;
  var mockActivityService: jasmine.SpyObj<ActivityService>;
  var mockTaskListService: jasmine.SpyObj<TaskListService>;
  var mockDateFormater: jasmine.SpyObj<DateFormaterService>;
  var mockPriorityConvertor: jasmine.SpyObj<PriorityConvertorService>;
  const mockTask: BoardTask = {
    id: '1',
    boardTaskListId: '1',
    name: 'Test Task',
    creationTime: new Date('2024-05-19'),
    dueTime: new Date('2024-05-20'),
    priority: Priority.High,
    description: 'This is a test task'
  };
  const mockTaskList: BoardTaskList = {
    id: '1',
    boardId: '1',
    creationTime: new Date('2024-05-19'),
    name: 'Test List',
    boardTasks: [mockTask]
  };
  const mockActivities: BoardTaskActivity[] = [
    { id: '1', boardTaskId: '1', description: 'Activity 1', activityTime: new Date('2024-05-17') },
    { id: '2', boardTaskId: '1', description: 'Activity 2', activityTime: new Date('2024-05-18') }
  ];

  beforeEach(waitForAsync(() => {
    mockDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    mockTaskListService = jasmine.createSpyObj<TaskListService>('TaskListService', ['getTaskListById']);
    mockActivityService = jasmine.createSpyObj<ActivityService>('ActivityService', ['getTaskActivitiesByTaskId']);
    mockDateFormater = jasmine.createSpyObj<DateFormaterService>('DateFormaterService', ['formatDate']);

    mockTaskListService.getTaskListById.and.returnValue(of(mockTaskList));
    mockActivityService.getTaskActivitiesByTaskId.and.returnValue(of(mockActivities));
    mockDateFormater.formatDate.and.callFake((date: Date) => date.toDateString())

    const sanitizerMock = {
      bypassSecurityTrustHtml: jasmine.createSpy('bypassSecurityTrustHtml').and.callFake((html: string) => html as SafeHtml)
    };

    TestBed.configureTestingModule({
      declarations: [TaskInfoComponent],
      imports: [MatDialogModule],
      providers: [
        PriorityConvertorService,
        { provide: DateFormaterService, useValue: mockDateFormater },
        { provide: MAT_DIALOG_DATA, useValue: { task: mockTask, currentTaskList: mockTaskList } },
        { provide: MatDialog, useValue: mockDialog },
        { provide: TaskListService, useValue: mockTaskListService },
        { provide: ActivityService, useValue: mockActivityService },
        { provide: PriorityConvertorService, useValue: mockPriorityConvertor },
        { provide: DomSanitizer, useValue: sanitizerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskInfoComponent);
    debugEl = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize task and currentTaskList', () => {
    expect(component.task).toEqual(mockTask);
  });
  it('should display task details correctly', () => {
    const taskNameElement: HTMLElement = debugEl.query(By.css('.card-name')).nativeElement;
    expect(taskNameElement.textContent).toEqual(mockTask.name!);
    const params = debugEl.queryAll(By.css('.param'));
    expect(params[0].nativeElement.textContent).toEqual(mockTaskList.name!);
    expect(params[1].nativeElement.textContent).toEqual(mockTask.dueTime?.toDateString()!);
    expect(params[2].nativeElement.textContent).toEqual(PriorityConvertorService.getPriorityString(mockTask.priority)!);
    const taskDescriptionElement: HTMLElement = debugEl.query(By.css('.description-body')).nativeElement;
    expect(taskDescriptionElement.textContent).toEqual(mockTask.description!);
  });
  it('should display task activities', () => {
    expect(mockActivityService.getTaskActivitiesByTaskId).toHaveBeenCalledWith(mockTask.id);
    const events = debugEl.queryAll(By.css('.event-description'));
    expect(events.length).toBe(2);
    const eventDescriptionElement: HTMLElement = debugEl.query(By.css('.event-description')).nativeElement;
    expect(eventDescriptionElement.textContent).toEqual(mockActivities[0].description!);
    const eventDateElement: HTMLElement = debugEl.query(By.css('.event-date')).nativeElement;
    expect(eventDateElement.textContent).toEqual(mockActivities[0].activityTime.toDateString());
  });
  it('should show loading state while activities are being fetched', () => {
    component.taskActivities$ = of(undefined);
    component.updateView();
    fixture.detectChanges();
    expect(debugEl.query(By.css('.activity-body')).nativeElement.textContent).toContain('Loading...');
  });
  it('should open edit menu when edit button is clicked', () => {
    const buttons = debugEl.queryAll(By.css('button'));
    buttons[1].nativeElement.click();
    expect(mockDialog.open).toHaveBeenCalled();
  });
});
