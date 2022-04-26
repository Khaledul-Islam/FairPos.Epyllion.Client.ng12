import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderReprintComponent } from './sales-order-reprint.component';

describe('SalesOrderReprintComponent', () => {
  let component: SalesOrderReprintComponent;
  let fixture: ComponentFixture<SalesOrderReprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesOrderReprintComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderReprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
