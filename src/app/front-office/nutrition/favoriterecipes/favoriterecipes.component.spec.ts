import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriterecipesComponent } from './favoriterecipes.component';

describe('FavoriterecipesComponent', () => {
  let component: FavoriterecipesComponent;
  let fixture: ComponentFixture<FavoriterecipesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoriterecipesComponent]
    });
    fixture = TestBed.createComponent(FavoriterecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
