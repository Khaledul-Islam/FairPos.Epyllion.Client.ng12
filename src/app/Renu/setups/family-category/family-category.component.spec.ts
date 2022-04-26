import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyCategoryComponent } from './family-category.component';

describe('FamilyCategoryComponent', () => {
  let component: FamilyCategoryComponent;
  let fixture: ComponentFixture<FamilyCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilyCategoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
