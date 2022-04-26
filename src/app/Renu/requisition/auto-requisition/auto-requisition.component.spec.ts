import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoRequisitionComponent } from './auto-requisition.component';

describe('AutoRequisitionComponent', () => {
  let component: AutoRequisitionComponent;
  let fixture: ComponentFixture<AutoRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutoRequisitionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
