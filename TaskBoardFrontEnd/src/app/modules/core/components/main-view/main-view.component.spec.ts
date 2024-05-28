import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BoardApiService, DevModeService, RedirectorService } from '../../../shared';
import { MainViewComponent } from './main-view.component';

describe('MainViewComponent', () => {
  var component: MainViewComponent;
  var fixture: ComponentFixture<MainViewComponent>;
  var debugEl: DebugElement;
  var mockDialog: jasmine.SpyObj<MatDialog>;
  var mockRouter: jasmine.SpyObj<Router>;
  var mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  var mockDevModeService: jasmine.SpyObj<DevModeService>;
  var mockBoardApiService: jasmine.SpyObj<BoardApiService>;
  let mockRedirector: jasmine.SpyObj<RedirectorService>;

  beforeEach(() => {
    mockDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    mockBoardApiService = jasmine.createSpyObj<BoardApiService>('BoardApiService', ['getBoardsByUserId']);
    mockActivatedRoute = jasmine.createSpyObj<ActivatedRoute>('ActivatedRoute', [], { params: of({}) });
    mockDevModeService = jasmine.createSpyObj<DevModeService>('DevModeService', ['isDevMode']);
    mockRedirector = jasmine.createSpyObj<RedirectorService>('RedirectorService', ['redirectToHome']);

    TestBed.configureTestingModule({
      declarations: [MainViewComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DevModeService, useValue: mockDevModeService },
        { provide: BoardApiService, useValue: mockBoardApiService },
        { provide: RedirectorService, useValue: mockRedirector }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(MainViewComponent);
    debugEl = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call redirectToHome on header click', () => {
    const headerElement = debugEl.query(By.css('.header'));
    headerElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(mockRedirector.redirectToHome).toHaveBeenCalled();
  });
});