import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionistAiComponent } from './nutritionist-ai.component';

describe('NutritionistAiComponent', () => {
  let component: NutritionistAiComponent;
  let fixture: ComponentFixture<NutritionistAiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NutritionistAiComponent]
    });
    fixture = TestBed.createComponent(NutritionistAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
