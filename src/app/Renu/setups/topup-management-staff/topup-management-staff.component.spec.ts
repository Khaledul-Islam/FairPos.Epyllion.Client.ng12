import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupManagementStaffComponent } from './topup-management-staff.component';

describe('TopupManagementStaffComponent', () => {
  let component: TopupManagementStaffComponent;
  let fixture: ComponentFixture<TopupManagementStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopupManagementStaffComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupManagementStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
