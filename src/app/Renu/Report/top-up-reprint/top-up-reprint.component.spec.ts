import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUpReprintComponent } from './top-up-reprint.component';

describe('TopUpReprintComponent', () => {
  let component: TopUpReprintComponent;
  let fixture: ComponentFixture<TopUpReprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopUpReprintComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopUpReprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
