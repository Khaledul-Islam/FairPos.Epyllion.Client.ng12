import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierReturnComponent } from './supplier-return.component';

describe('SupplierReturnComponent', () => {
  let component: SupplierReturnComponent;
  let fixture: ComponentFixture<SupplierReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierReturnComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
