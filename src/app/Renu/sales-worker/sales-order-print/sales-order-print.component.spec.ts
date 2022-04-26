import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderPrintComponent } from './sales-order-print.component';

describe('SalesOrderPrintComponent', () => {
  let component: SalesOrderPrintComponent;
  let fixture: ComponentFixture<SalesOrderPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesOrderPrintComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
