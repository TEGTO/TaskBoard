import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { BoardActivity } from '../../../../shared';
import { ActivityService } from '../../../services/acitvity-service/activity-service';
import { ActivityHistoryComponent } from './activity-history.component';

describe('ActivityHistoryComponent', () => {
  const mockActivity: BoardActivity = { id: "1", userId: "1", activityTime: new Date() }
  const mockActivities: BoardActivity[] = [mockActivity, mockActivity, mockActivity];
  var component: ActivityHistoryComponent;
  var fixture: ComponentFixture<ActivityHistoryComponent>;
  var activityService: jasmine.SpyObj<ActivityService>;
  var debugEl: DebugElement;

  beforeEach(async () => {
    activityService = jasmine.createSpyObj<ActivityService>('ActivityService', ['getBoardActivitiesOnPage', 'getBoardActivityAmount']);
    activityService.getBoardActivitiesOnPage.and.returnValue(of(mockActivities));
    activityService.getBoardActivityAmount.and.returnValue(of(mockActivities.length));
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [ActivityHistoryComponent],
      providers: [
        { provide: ActivityService, useValue: activityService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    activityService = TestBed.inject(ActivityService) as jasmine.SpyObj<ActivityService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityHistoryComponent);
    debugEl = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(activityService.getBoardActivitiesOnPage).toHaveBeenCalledWith(component.page, component.amountOnPage);
    expect(activityService.getBoardActivityAmount).toHaveBeenCalled();
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
    activityService.getBoardActivityAmount.and.returnValue(of(2 * mockActivities.length));
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
    expect(activityService.getBoardActivitiesOnPage).toHaveBeenCalledWith(onPage++, component.amountOnPage);
    expect(component.activitiesAmount).toEqual(2 * mockActivities.length);
    expect(component.activities).toEqual([...mockActivities, ...mockActivities]);
  });
});
