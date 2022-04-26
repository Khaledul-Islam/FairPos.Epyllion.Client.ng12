import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionToPoApprovalComponent } from './requisition-to-po-approval.component';

describe('RequisitionToPoApprovalComponent', () => {
  let component: RequisitionToPoApprovalComponent;
  let fixture: ComponentFixture<RequisitionToPoApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequisitionToPoApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionToPoApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
