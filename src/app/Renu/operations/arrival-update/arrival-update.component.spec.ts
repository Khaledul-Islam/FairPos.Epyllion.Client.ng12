import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalUpdateComponent } from './arrival-update.component';

describe('ArrivalUpdateComponent', () => {
  let component: ArrivalUpdateComponent;
  let fixture: ComponentFixture<ArrivalUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArrivalUpdateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrivalUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
