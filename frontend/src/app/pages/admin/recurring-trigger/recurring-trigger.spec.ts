import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringTrigger } from './recurring-trigger';

describe('RecurringTrigger', () => {
  let component: RecurringTrigger;
  let fixture: ComponentFixture<RecurringTrigger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringTrigger]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringTrigger);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
