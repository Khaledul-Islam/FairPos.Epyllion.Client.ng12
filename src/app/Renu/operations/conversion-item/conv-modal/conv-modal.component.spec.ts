import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvModalComponent } from './conv-modal.component';

describe('ConvModalComponent', () => {
  let component: ConvModalComponent;
  let fixture: ComponentFixture<ConvModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConvModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
