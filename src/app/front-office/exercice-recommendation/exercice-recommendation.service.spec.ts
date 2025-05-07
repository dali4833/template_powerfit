import { TestBed } from '@angular/core/testing';

import { ExerciceRecommendationService } from './exercice-recommendation.service';

describe('ExerciceRecommendationService', () => {
  let service: ExerciceRecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciceRecommendationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
