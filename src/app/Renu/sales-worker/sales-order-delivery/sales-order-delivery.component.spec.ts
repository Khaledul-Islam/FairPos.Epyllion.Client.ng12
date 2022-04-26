import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderDeliveryComponent } from './sales-order-delivery.component';

describe('SalesOrderDeliveryComponent', () => {
  let component: SalesOrderDeliveryComponent;
  let fixture: ComponentFixture<SalesOrderDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesOrderDeliveryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
