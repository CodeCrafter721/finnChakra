import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forbidden403 } from './forbidden-403';

describe('Forbidden403', () => {
  let component: Forbidden403;
  let fixture: ComponentFixture<Forbidden403>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forbidden403]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Forbidden403);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
