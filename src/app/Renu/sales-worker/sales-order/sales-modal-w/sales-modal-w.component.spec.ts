import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesModalWComponent } from './sales-modal-w.component';

describe('SalesModalWComponent', () => {
  let component: SalesModalWComponent;
  let fixture: ComponentFixture<SalesModalWComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesModalWComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesModalWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
