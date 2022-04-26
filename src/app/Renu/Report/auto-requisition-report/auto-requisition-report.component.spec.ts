import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoRequisitionReportComponent } from './auto-requisition-report.component';

describe('AutoRequisitionReportComponent', () => {
  let component: AutoRequisitionReportComponent;
  let fixture: ComponentFixture<AutoRequisitionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutoRequisitionReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRequisitionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
