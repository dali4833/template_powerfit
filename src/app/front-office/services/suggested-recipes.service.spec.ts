import { TestBed } from '@angular/core/testing';

import { SuggestedRecipesService } from './suggested-recipes.service';

describe('SuggestedRecipesService', () => {
  let service: SuggestedRecipesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuggestedRecipesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
