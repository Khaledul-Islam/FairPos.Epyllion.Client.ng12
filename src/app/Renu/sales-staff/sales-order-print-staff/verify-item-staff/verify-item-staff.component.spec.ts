import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyItemStaffComponent } from './verify-item-staff.component';

describe('VerifyItemStaffComponent', () => {
  let component: VerifyItemStaffComponent;
  let fixture: ComponentFixture<VerifyItemStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyItemStaffComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyItemStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
