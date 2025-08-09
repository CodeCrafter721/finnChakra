import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdForm } from './threshold-form';

describe('ThresholdForm', () => {
  let component: ThresholdForm;
  let fixture: ComponentFixture<ThresholdForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThresholdForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThresholdForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
