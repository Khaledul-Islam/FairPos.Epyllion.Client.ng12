import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalModalComponent } from './arrival-modal.component';

describe('ArrivalModalComponent', () => {
  let component: ArrivalModalComponent;
  let fixture: ComponentFixture<ArrivalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArrivalModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrivalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
