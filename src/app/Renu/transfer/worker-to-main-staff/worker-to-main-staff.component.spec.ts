import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerToMainStaffComponent } from './worker-to-main-staff.component';

describe('WorkerToMainStaffComponent', () => {
  let component: WorkerToMainStaffComponent;
  let fixture: ComponentFixture<WorkerToMainStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkerToMainStaffComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerToMainStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
