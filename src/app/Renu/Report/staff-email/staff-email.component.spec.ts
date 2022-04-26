import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffEmailComponent } from './staff-email.component';

describe('StaffEmailComponent', () => {
  let component: StaffEmailComponent;
  let fixture: ComponentFixture<StaffEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffEmailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
