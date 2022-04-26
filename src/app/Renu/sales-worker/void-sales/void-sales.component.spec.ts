import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidSalesComponent } from './void-sales.component';

describe('VoidSalesComponent', () => {
  let component: VoidSalesComponent;
  let fixture: ComponentFixture<VoidSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoidSalesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
