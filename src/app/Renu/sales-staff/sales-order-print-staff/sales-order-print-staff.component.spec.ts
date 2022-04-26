import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderPrintStaffComponent } from './sales-order-print-staff.component';

describe('SalesOrderPrintStaffComponent', () => {
  let component: SalesOrderPrintStaffComponent;
  let fixture: ComponentFixture<SalesOrderPrintStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesOrderPrintStaffComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderPrintStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
