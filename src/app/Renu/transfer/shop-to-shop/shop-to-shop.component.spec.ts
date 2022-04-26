import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopToShopComponent } from './shop-to-shop.component';

describe('ShopToShopComponent', () => {
  let component: ShopToShopComponent;
  let fixture: ComponentFixture<ShopToShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopToShopComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopToShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
