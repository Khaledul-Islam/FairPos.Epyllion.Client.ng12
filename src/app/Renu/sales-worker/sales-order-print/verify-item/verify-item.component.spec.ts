import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyItemComponent } from './verify-item.component';

describe('VerifyItemComponent', () => {
  let component: VerifyItemComponent;
  let fixture: ComponentFixture<VerifyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
