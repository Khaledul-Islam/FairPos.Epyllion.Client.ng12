import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelectionSupplierComponent } from './item-selection-supplier.component';

describe('ItemSelectionSupplierComponent', () => {
  let component: ItemSelectionSupplierComponent;
  let fixture: ComponentFixture<ItemSelectionSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemSelectionSupplierComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSelectionSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
