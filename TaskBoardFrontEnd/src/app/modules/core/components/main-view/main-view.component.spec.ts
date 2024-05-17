import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { MainViewComponent } from './main-view.component';

describe('MainViewComponent', () => {
  let component: MainViewComponent;
  let fixture: ComponentFixture<MainViewComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [MainViewComponent],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
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
  it('should render div with class "root" and task-board component', () => {
    const rootDiv = debugEl.query(By.css('.root'));
    expect(rootDiv).toBeTruthy();
    const taskBoardComponent = debugEl.query(By.css('task-board'));
    expect(taskBoardComponent).toBeTruthy();
  });
});