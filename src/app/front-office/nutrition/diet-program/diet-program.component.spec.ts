import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietProgramComponent } from './diet-program.component';

describe('DietProgramComponent', () => {
  let component: DietProgramComponent;
  let fixture: ComponentFixture<DietProgramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DietProgramComponent]
    });
    fixture = TestBed.createComponent(DietProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
