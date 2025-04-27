import { Component, OnInit } from '@angular/core';
import { DietProgram } from '../models/DietProgram';
import { DietProgramService } from '../../services/diet-program.service';
import { MealPlanService } from '../../services/meal-plan.service';
import { MealPlan } from '../models/MealPlan';
import { Recipe } from '../models/Recipe';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.css']
})
export class MealPlanComponent implements OnInit {
  mealPlans: MealPlan[] = [];
  newMeal: MealPlan = new MealPlan();
  dietPrograms: DietProgram[] = [];
  recipes: Recipe[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  roles: any;
  editMode: boolean = false;
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Pagination
  pageSize = 5;
  currentPage = 1;

  constructor(
    private mealPlanService: MealPlanService,
    private dietProgramService: DietProgramService,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMealPlans();
    this.loadDietPrograms();
    this.loadRecipes();
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe((res) => {
      this.roles = res?.user_type;
    });
  }
  getPagesArray(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }
  loadRecipes(): void {
    this.recipeService.getAll().subscribe({
      next: (data) => {
        this.recipes = data;
      },
      error: (err) => {
        console.error('Error loading recipes', err);
      }
    });
  }

  loadMealPlans(): void {
    this.isLoading = true;
    this.mealPlanService.getAll().subscribe({
      next: (data) => {
        this.mealPlans = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Load error occurred', err);
        this.errorMessage = 'Failed to load meal plans';
        this.isLoading = false;
      },
    });
  }

  addMealPlan(): void {
    if (this.editMode) {
      this.updateMealPlan();
      return;
    }
    
    this.mealPlanService.create(this.newMeal).subscribe({
      next: () => {
        this.showSuccess('Meal plan added successfully!');
        this.resetForm();
        this.loadMealPlans();
      },
      error: (err) => {
        this.showError('Failed to add meal plan');
        console.error('Add error occurred', err);
      },
    });
  }
  updateMealPlan(): void {
    if (!this.newMeal.idMealPlan) {
      this.showError('Cannot update - meal plan ID is missing');
      return;
    }
  
    this.mealPlanService.update(this.newMeal.idMealPlan, this.newMeal).subscribe({
      next: () => {
        this.showSuccess('Meal plan updated successfully!');
        this.resetForm();
        this.loadMealPlans();
        this.editMode = false;
      },
      error: (err) => {
        this.showError('Failed to update meal plan');
        console.error('Update error occurred', err);
      },
    });
  }

  confirmDelete(id: number | undefined): void {
    if (id === undefined) {
      console.error('Cannot delete - meal plan ID is undefined');
      return;
    }
    if (confirm('Are you sure you want to delete this meal plan?')) {
      this.deleteMealPlan(id);
    }
  }

  deleteMealPlan(id: number): void {
    this.mealPlanService.delete(id).subscribe({
      next: () => {
        this.showSuccess('Meal plan deleted successfully!');
        this.loadMealPlans();
      },
      error: (err) => {
        this.showError('Failed to delete meal plan');
        console.error('Delete error occurred', err);
      },
    });
  }

  loadDietPrograms(): void {
    this.dietProgramService.getAll().subscribe({
      next: (data) => this.dietPrograms = data,
      error: (err) => console.error('Error loading diet programs', err),
    });
  }

  editMealPlan(meal: MealPlan): void {
    this.newMeal = { ...meal };
    this.editMode = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm(): void {
    this.newMeal = new MealPlan();
    this.editMode = false;
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 3000);
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.mealPlans.length / this.pageSize);
  }

  paginatedMeals() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.mealPlans.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }
  getFirstItemIndex(): number {
    if (this.mealPlans.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  
  getLastItemIndex(): number {
    if (this.mealPlans.length === 0) return 0;
    return Math.min(this.currentPage * this.pageSize, this.mealPlans.length);
  }
}