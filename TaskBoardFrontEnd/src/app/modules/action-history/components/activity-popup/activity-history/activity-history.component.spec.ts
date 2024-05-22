import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Board, BoardActivity } from '../../../../shared';
import { ActivityPopupData, ActivityService } from '../../../index';
import { ActivityHistoryComponent } from './activity-history.component';

describe('ActivityHistoryComponent', () => {
  const mockBoardData: Board = { id: "1", userId: "1", creationTime: new Date() };
  const mockActivity: BoardActivity = { id: "1", boardId: mockBoardData.id, activityTime: new Date() }
  const mockActivities: BoardActivity[] = [mockActivity, mockActivity, mockActivity];
  const mockPopupData: ActivityPopupData = { board: mockBoardData };
  var component: ActivityHistoryComponent;
  var fixture: ComponentFixture<ActivityHistoryComponent>;
  var activityService: jasmine.SpyObj<ActivityService>;
  var debugEl: DebugElement;

  beforeEach(async () => {
    activityService = jasmine.createSpyObj<ActivityService>('ActivityService', ['getBoardActivitiesOnPageByBoardId', 'getBoardActivityAmountByBoardId']);
    activityService.getBoardActivitiesOnPageByBoardId.and.returnValue(of(mockActivities));
    activityService.getBoardActivityAmountByBoardId.and.returnValue(of(mockActivities.length));
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [ActivityHistoryComponent],
      providers: [
        { provide: ActivityService, useValue: activityService },
        { provide: MAT_DIALOG_DATA, useValue: mockPopupData },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    activityService = TestBed.inject(ActivityService) as jasmine.SpyObj<ActivityService>;
    fixture = TestBed.createComponent(ActivityHistoryComponent);
    debugEl = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(activityService.getBoardActivitiesOnPageByBoardId).toHaveBeenCalledWith(mockBoardData.id, component.page, component.amountOnPage);
    expect(activityService.getBoardActivityAmountByBoardId).toHaveBeenCalledWith(mockBoardData.id);
  });
  it('should render dialog close button', () => {
    const closeButtonDebugElements = fixture.debugElement.queryAll(By.directive(MatDialogClose));
    expect(closeButtonDebugElements.length).toBe(1);
    const closeButtonElement = closeButtonDebugElements[0].nativeElement;
    closeButtonElement.click();
  });
  it('should load activities on initialization', () => {
    expect(component.activities).toEqual(mockActivities);
    expect(component.activitiesAmount).toEqual(mockActivities.length);
  });
  it('should load more activities on showMore', () => {
    activityService.getBoardActivityAmountByBoardId.and.returnValue(of(2 * mockActivities.length));
    fixture = TestBed.createComponent(ActivityHistoryComponent);
    debugEl = fixture.debugElement;
    component = fixture.componentInstance;
    component.amountOnPage = mockActivities.length;
    fixture.detectChanges();
    var onPage = component.page;
    const buttons = debugEl.queryAll(By.css("button"));
    expect(buttons.length).toBe(2);
    buttons[1].nativeElement.click();
    fixture.detectChanges();
    expect(activityService.getBoardActivitiesOnPageByBoardId).toHaveBeenCalledWith(mockBoardData.id, onPage++, component.amountOnPage);
    expect(component.activitiesAmount).toEqual(2 * mockActivities.length);
    expect(component.activities).toEqual([...mockActivities, ...mockActivities]);
  });
});
