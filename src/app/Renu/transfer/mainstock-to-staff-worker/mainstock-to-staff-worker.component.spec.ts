import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainstockToStaffWorkerComponent } from './mainstock-to-staff-worker.component';

describe('MainstockToStaffWorkerComponent', () => {
  let component: MainstockToStaffWorkerComponent;
  let fixture: ComponentFixture<MainstockToStaffWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainstockToStaffWorkerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainstockToStaffWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
