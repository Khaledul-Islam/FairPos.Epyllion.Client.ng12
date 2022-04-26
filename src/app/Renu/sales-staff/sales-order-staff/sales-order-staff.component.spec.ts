import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderStaffComponent } from './sales-order-staff.component';

describe('SalesOrderStaffComponent', () => {
  let component: SalesOrderStaffComponent;
  let fixture: ComponentFixture<SalesOrderStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesOrderStaffComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
