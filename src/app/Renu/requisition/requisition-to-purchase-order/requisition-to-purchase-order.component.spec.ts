import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionToPurchaseOrderComponent } from './requisition-to-purchase-order.component';

describe('RequisitionToPurchaseOrderComponent', () => {
  let component: RequisitionToPurchaseOrderComponent;
  let fixture: ComponentFixture<RequisitionToPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequisitionToPurchaseOrderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionToPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
