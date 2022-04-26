import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsApproveComponent } from './items-approve.component';

describe('ItemsApproveComponent', () => {
  let component: ItemsApproveComponent;
  let fixture: ComponentFixture<ItemsApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemsApproveComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
