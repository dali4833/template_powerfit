import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MealPlan } from '../nutrition/models/MealPlan';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class MealPlanService {
  private apiUrl = 'http://localhost:8089/mealplan';

  constructor(private http: HttpClient, private headerService: HeaderService) {}

  // Get all meal plans
  getAll(): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(`${this.apiUrl}/retrieve-allMealPlans`, {
      headers: this.headerService.getHeader(),
    });
  }

  // Get by ID - updated to use path variable
  getById(id: number): Observable<MealPlan> {
    return this.http.get<MealPlan>(`${this.apiUrl}/retrieve-mealPlan/${id}`, {
      headers: this.headerService.getHeader(),
    });
  }

  // Create meal plan (using MealPlan model)
  create(mealPlan: MealPlan): Observable<MealPlan> {
    // Ensure we're sending the correct structure
    const requestBody = {
      dayOfWeek: mealPlan.dayOfWeek,
      description: mealPlan.description,
      userId: mealPlan.userId,
      mealType: mealPlan.mealType,      
      mealOrder: mealPlan.mealOrder,     
      userEmail: mealPlan.userEmail,     
      dietProgramId: mealPlan.dietProgramId,
      recipeId: mealPlan.recipeId
    };
    
    return this.http.post<MealPlan>(
      `${this.apiUrl}/create`, 
      requestBody,
      { headers: this.headerService.getHeader() }
    );
  }

  // Update meal plan
  update(id: number, mealPlan: MealPlan): Observable<MealPlan> {
    const requestBody = {
      dayOfWeek: mealPlan.dayOfWeek,
      description: mealPlan.description,
      userId: mealPlan.userId,
      mealType: mealPlan.mealType,
      mealOrder: mealPlan.mealOrder,
      userEmail: mealPlan.userEmail,
      dietProgramId: mealPlan.dietProgramId,
      recipeId: mealPlan.recipeId
    };
    
    return this.http.put<MealPlan>(
      `${this.apiUrl}/update-mealplan/${id}`,  
      requestBody,
      { headers: this.headerService.getHeader() }
    );
  }
  
  // Delete meal plan
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-mealPlan/${id}`, {
      headers: this.headerService.getHeader(),
    });
  }

  // Add many meal plans
  addMany(mealPlans: MealPlan[]): Observable<MealPlan[]> {
    const requestBodies = mealPlans.map(mp => ({
      dayOfWeek: mp.dayOfWeek,
      description: mp.description,
      userId: mp.userId,
      mealType: mp.mealType,
      mealOrder: mp.mealOrder,
      userEmail: mp.userEmail,
      dietProgramId: mp.dietProgramId,
      recipeId: mp.recipeId
    }));
    
    return this.http.post<MealPlan[]>(
      `${this.apiUrl}/add-manyMealPlans`, 
      requestBodies,
      { headers: this.headerService.getHeader() }
    );
  }

  // Search methods
  findByMultipleUserIds(userIds: number[]): Observable<MealPlan[]> {
    const params = userIds.map(id => `userIds=${id}`).join('&');
    return this.http.get<MealPlan[]>(`${this.apiUrl}/findByMultipleUserIds?${params}`, {
      headers: this.headerService.getHeader(),
    });
  }

  findByMultipleDays(days: string[]): Observable<MealPlan[]> {
    const params = days.map(day => `daysOfWeek=${day}`).join('&');
    return this.http.get<MealPlan[]>(`${this.apiUrl}/findByMultipleDaysOfWeek?${params}`, {
      headers: this.headerService.getHeader(),
    });
  }

  findByUserIdAndDay(userId: number, day: string): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(
      `${this.apiUrl}/findByUserIdAndDayOfWeek?userId=${userId}&dayOfWeek=${day}`,
      { headers: this.headerService.getHeader() }
    );
  }

  findByUserIdsAndDays(userIds: number[], days: string[]): Observable<MealPlan[]> {
    const userParams = userIds.map(id => `userIds=${id}`).join('&');
    const dayParams = days.map(day => `daysOfWeek=${day}`).join('&');
    return this.http.get<MealPlan[]>(
      `${this.apiUrl}/findByUserIdsAndDaysOfWeek?${userParams}&${dayParams}`,
      { headers: this.headerService.getHeader() }
    );
  }

  // New method - Get by meal type
  findByMealType(mealType: string): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(
      `${this.apiUrl}/by-meal-type/${mealType}`,
      { headers: this.headerService.getHeader() }
    );
  }
}