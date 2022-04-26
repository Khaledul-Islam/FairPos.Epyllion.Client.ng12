import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSyncComponent } from './employee-sync.component';

describe('EmployeeSyncComponent', () => {
  let component: EmployeeSyncComponent;
  let fixture: ComponentFixture<EmployeeSyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeSyncComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
