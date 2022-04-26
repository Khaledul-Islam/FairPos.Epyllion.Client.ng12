import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageLossComponent } from './damage-loss.component';

describe('DamageLossComponent', () => {
  let component: DamageLossComponent;
  let fixture: ComponentFixture<DamageLossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DamageLossComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageLossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
