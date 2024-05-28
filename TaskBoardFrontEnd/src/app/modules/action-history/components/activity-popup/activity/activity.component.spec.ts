import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { BoardActivity, DATE_CONFIG, DateFormaterService } from '../../../../shared';
import { ActivityComponent } from './activity.component';

describe('ActivityComponent', () => {
  let component: ActivityComponent;
  let fixture: ComponentFixture<ActivityComponent>;
  let sanitizer: jasmine.SpyObj<DomSanitizer>;
  let mockActivity: BoardActivity = { id: "1", boardId: "1", activityTime: new Date() }

  beforeEach(async () => {
    sanitizer = jasmine.createSpyObj<DomSanitizer>('DomSanitizer', ['bypassSecurityTrustHtml']);
    await TestBed.configureTestingModule({
      declarations: [ActivityComponent],
      providers: [
        DateFormaterService,
        { provide: DATE_CONFIG, useValue: { format: 'EEE, d MMM YYYY' } },
        { provide: DomSanitizer, useValue: sanitizer }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityComponent);
    component = fixture.componentInstance;
    component.activity = mockActivity;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render activity description if it exists', () => {
    const activity: BoardActivity = { id: "1", boardId: "1", activityTime: new Date(), description: "description" };
    component.activity = activity;
    sanitizer.bypassSecurityTrustHtml.and.returnValue(activity.description!);
    component.updateView();
    fixture.detectChanges();

    const activityDescriptionElement: HTMLElement | null = fixture.nativeElement.querySelector('.activity-description');
    expect(activityDescriptionElement).toBeTruthy();
    expect(activityDescriptionElement!.innerHTML).toContain(activity.description!);
  });

  it('should not render activity description if it does not exist', () => {
    fixture.detectChanges();

    const activityDescriptionElement: HTMLElement | null = fixture.nativeElement.querySelector('.activity-description');
    expect(activityDescriptionElement).toBeFalsy();
  });

  it('should render activity date with proper formatting', () => {
    const activity: BoardActivity = { id: "1", boardId: "1", activityTime: new Date('2024-05-16T12:00:00Z'), description: "description" };
    component.activity = activity;
    component.updateView();
    fixture.detectChanges();

    const activityDateElement: HTMLElement | null = fixture.nativeElement.querySelector('.activity-date');
    expect(activityDateElement).toBeTruthy();
    expect(activityDateElement!.textContent).toContain(component.getFormatedDate(activity.activityTime));
  });
});