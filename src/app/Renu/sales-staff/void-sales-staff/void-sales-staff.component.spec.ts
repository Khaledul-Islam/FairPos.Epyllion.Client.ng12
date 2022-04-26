import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidSalesStaffComponent } from './void-sales-staff.component';

describe('VoidSalesStaffComponent', () => {
  let component: VoidSalesStaffComponent;
  let fixture: ComponentFixture<VoidSalesStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoidSalesStaffComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidSalesStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
