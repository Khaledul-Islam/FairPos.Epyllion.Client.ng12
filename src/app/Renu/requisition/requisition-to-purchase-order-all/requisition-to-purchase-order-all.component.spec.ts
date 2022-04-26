import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionToPurchaseOrderAllComponent } from './requisition-to-purchase-order-all.component';

describe('RequisitionToPurchaseOrderAllComponent', () => {
  let component: RequisitionToPurchaseOrderAllComponent;
  let fixture: ComponentFixture<RequisitionToPurchaseOrderAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequisitionToPurchaseOrderAllComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionToPurchaseOrderAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
