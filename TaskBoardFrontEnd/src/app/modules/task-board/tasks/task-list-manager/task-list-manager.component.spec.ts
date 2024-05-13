import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListManagerComponent } from './task-list-manager.component';

describe('TaskListManagerComponent', () => {
  let component: TaskListManagerComponent;
  let fixture: ComponentFixture<TaskListManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskListManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskListManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
