import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciceRecommendationComponent } from './exercice-recommendation.component';

describe('ExerciceRecommendationComponent', () => {
  let component: ExerciceRecommendationComponent;
  let fixture: ComponentFixture<ExerciceRecommendationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExerciceRecommendationComponent]
    });
    fixture = TestBed.createComponent(ExerciceRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
