import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalReportComponent } from './arrival-report.component';

describe('ArrivalReportComponent', () => {
  let component: ArrivalReportComponent;
  let fixture: ComponentFixture<ArrivalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArrivalReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrivalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
