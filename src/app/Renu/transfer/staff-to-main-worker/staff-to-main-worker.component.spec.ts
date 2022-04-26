import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffToMainWorkerComponent } from './staff-to-main-worker.component';

describe('StaffToMainWorkerComponent', () => {
  let component: StaffToMainWorkerComponent;
  let fixture: ComponentFixture<StaffToMainWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffToMainWorkerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffToMainWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
