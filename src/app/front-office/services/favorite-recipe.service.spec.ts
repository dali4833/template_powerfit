import { TestBed } from '@angular/core/testing';

import { FavoriteRecipeService } from './favorite-recipe.service';

describe('FavoriteRecipeService', () => {
  let service: FavoriteRecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteRecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
