import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffBalanceComponent } from './staff-balance.component';

describe('StaffBalanceComponent', () => {
  let component: StaffBalanceComponent;
  let fixture: ComponentFixture<StaffBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffBalanceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
