import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyCategoryLimitComponent } from './family-category-limit.component';

describe('FamilyCategoryLimitComponent', () => {
  let component: FamilyCategoryLimitComponent;
  let fixture: ComponentFixture<FamilyCategoryLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilyCategoryLimitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyCategoryLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
