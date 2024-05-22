import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DevModeService } from '../../../shared';
import { MainViewComponent } from './main-view.component';

describe('MainViewComponent', () => {
  var component: MainViewComponent;
  var fixture: ComponentFixture<MainViewComponent>;
  var debugEl: DebugElement;
  var mockDialog: jasmine.SpyObj<MatDialog>;
  var mockRouter: jasmine.SpyObj<Router>;
  var mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  var mockDevModeService: jasmine.SpyObj<DevModeService>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj<ActivatedRoute>('ActivatedRoute', [], { params: of({}) });
    mockDevModeService = jasmine.createSpyObj<DevModeService>('DevModeService', ['isDevMode']);

    await TestBed.configureTestingModule({
      declarations: [MainViewComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DevModeService, useValue: mockDevModeService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainViewComponent);
    debugEl = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to board 1 if in dev mode', () => {
    mockDevModeService.isDevMode.and.returnValue(true);
    component.ngOnInit();
    expect(mockDevModeService.isDevMode).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['1'], { relativeTo: mockActivatedRoute });
  });
  it('should not navigate to board 1 if not in dev mode', () => {
    mockDevModeService.isDevMode.and.returnValue(false);
    component.ngOnInit();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockDevModeService.isDevMode).toHaveBeenCalled();
  });
});