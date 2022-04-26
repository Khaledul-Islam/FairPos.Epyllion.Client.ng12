import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReOrderItemComponent } from './re-order-item.component';

describe('ReOrderItemComponent', () => {
  let component: ReOrderItemComponent;
  let fixture: ComponentFixture<ReOrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReOrderItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
