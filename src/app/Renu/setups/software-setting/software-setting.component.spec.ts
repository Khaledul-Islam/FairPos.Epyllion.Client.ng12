import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareSettingComponent } from './software-setting.component';

describe('SoftwareSettingComponent', () => {
  let component: SoftwareSettingComponent;
  let fixture: ComponentFixture<SoftwareSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoftwareSettingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
