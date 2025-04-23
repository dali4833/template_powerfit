import { Component } from '@angular/core';
import { DietProgram } from '../models/DietProgram';
import { DietProgramService } from '../../services/diet-program.service';
import { MealPlanService } from '../../services/meal-plan.service';
import { MealPlan } from '../models/MealPlan';
import { Recipe } from '../models/Recipe';
import { RecipeService } from '../../services/recipe.service';
@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.css']
})
export class MealPlanComponent {
  mealPlans: MealPlan[] = [];
  newMeal: MealPlan = new MealPlan();
  dietPrograms: DietProgram[]= [];
  recipes: Recipe[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  

  constructor(private mealPlanService: MealPlanService,
    private dietProgramService: DietProgramService,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.loadMealPlans();
    this.loadDietPrograms();
    this.loadRecipes()
  
  }
  loadRecipes(): void {
    this.recipeService.getAll().subscribe({
      next: (data) => {
        this.recipes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des recettes', err);
      }
    });
  }

  loadMealPlans(): void {
    this.mealPlanService.getAll().subscribe({
      next: (data) => (this.mealPlans = data),
      error: (err) => {
        console.error('Load error occured', err);
        this.errorMessage = 'Failed to load meal plans';
      },
    });
  }

  addMealPlan(): void {
    this.mealPlanService.create(this.newMeal).subscribe({
      next: () => {
        this.successMessage = 'Meal plan added successfully!';
        this.errorMessage = '';
        this.newMeal = new MealPlan(); // reset form
        this.loadMealPlans();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Add error occurred', err);
        this.errorMessage = 'Failed to add meal plan.';
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }
  confirmDelete(id: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this meal plan?');
    if (confirmed) {
      this.deleteMealPlan(id);
    }
  }
  deleteMealPlan(id: number): void {
    this.mealPlanService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Meal plan deleted successfully!';
        this.loadMealPlans();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Delete error occurred', err);
        this.errorMessage = 'Failed to delete meal plan.';
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }
  loadDietPrograms(): void {
    this.dietProgramService.getAll().subscribe({
      next: (data) => this.dietPrograms = data,
      error: (err) => console.error('Error to load Diet Programs sorry', err),
    });
  }
  editMode: boolean = false; // juste bch naarf ken ena f mode l modification 

editMealPlan(meal: MealPlan): void {
  this.newMeal = { ...meal }; 
  this.editMode = true;
}}
