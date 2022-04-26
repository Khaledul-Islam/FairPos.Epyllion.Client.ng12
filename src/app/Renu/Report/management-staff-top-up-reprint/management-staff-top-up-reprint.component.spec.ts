import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementStaffTopUpReprintComponent } from './management-staff-top-up-reprint.component';

describe('ManagementStaffTopUpReprintComponent', () => {
  let component: ManagementStaffTopUpReprintComponent;
  let fixture: ComponentFixture<ManagementStaffTopUpReprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagementStaffTopUpReprintComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementStaffTopUpReprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
