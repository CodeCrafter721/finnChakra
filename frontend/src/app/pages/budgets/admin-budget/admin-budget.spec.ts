import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBudget } from './admin-budget';

describe('AdminBudget', () => {
  let component: AdminBudget;
  let fixture: ComponentFixture<AdminBudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBudget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBudget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
