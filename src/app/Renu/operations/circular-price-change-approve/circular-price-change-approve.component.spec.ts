import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularPriceChangeApproveComponent } from './circular-price-change-approve.component';

describe('CircularPriceChangeApproveComponent', () => {
  let component: CircularPriceChangeApproveComponent;
  let fixture: ComponentFixture<CircularPriceChangeApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircularPriceChangeApproveComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircularPriceChangeApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
