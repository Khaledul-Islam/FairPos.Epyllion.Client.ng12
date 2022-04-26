import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesModalWStaffComponent } from './sales-modal-w-staff.component';

describe('SalesModalWStaffComponent', () => {
  let component: SalesModalWStaffComponent;
  let fixture: ComponentFixture<SalesModalWStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesModalWStaffComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesModalWStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
