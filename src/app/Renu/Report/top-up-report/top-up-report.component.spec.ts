import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUpReportComponent } from './top-up-report.component';

describe('TopUpReportComponent', () => {
  let component: TopUpReportComponent;
  let fixture: ComponentFixture<TopUpReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopUpReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopUpReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
