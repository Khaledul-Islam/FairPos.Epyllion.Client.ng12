import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderDeliveryStaffComponent } from './sales-order-delivery-staff.component';

describe('SalesOrderDeliveryStaffComponent', () => {
  let component: SalesOrderDeliveryStaffComponent;
  let fixture: ComponentFixture<SalesOrderDeliveryStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesOrderDeliveryStaffComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderDeliveryStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
