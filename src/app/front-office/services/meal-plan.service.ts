import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MealPlan } from '../nutrition/models/MealPlan';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class MealPlanService {

  private apiUrl = 'http://localhost:8089/Powfit/mealplan';

  constructor(private http: HttpClient, private headerService: HeaderService) {}

  //  trécupéri  les meal plans lkol
  getAll(): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(`${this.apiUrl}/retrieve-allMealPlans`, {
      headers: this.headerService.getHeader(),
    });
  }

  // trécupéri un meal plan bel ID (tstaaml RequestParam)
  getById(id: number): Observable<MealPlan> {
    return this.http.get<MealPlan>(`${this.apiUrl}/retrieve-mealPlan?id=${id}`,{
      headers: this.headerService.getHeader(),
    });
  }

  //tajouti  meal plan
  create(mealPlan: MealPlan): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-mealPlan`, mealPlan,{
    responseType: 'text',headers: this.headerService.getHeader()},    
    );
  }

  // tmodifi  meal plan
  update(mealPlan: MealPlan): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/update-mealplan`,  
      mealPlan,                          
      {
        responseType: 'text',            
        headers: this.headerService.getHeader() 
      }
    );
  }
  
  // tsupprimi meal plan
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-mealPlan/${id}`,{
      headers: this.headerService.getHeader(),
    });
  }

  // tajouter plusieurs meal plans
  addMany(mealPlans: MealPlan[]): Observable<MealPlan[]> {
    return this.http.post<MealPlan[]>(`${this.apiUrl}/add-manyMealPlans`, mealPlans,{
      headers: this.headerService.getHeader(),
    });
  }

  // taaml search Rechercher par plusieurs userIds (hedhy func testaamlha nutritionist)
  findByMultipleUserIds(userIds: number[]): Observable<MealPlan[]> {
    const params = userIds.map(id => `userIds=${id}`).join('&');
    return this.http.get<MealPlan[]>(`${this.apiUrl}/findByMultipleUserIds?${params}`,{
      headers: this.headerService.getHeader(),
    });
  }

  // tsearchy par plusieurs jours
  findByMultipleDays(days: string[]): Observable<MealPlan[]> {
    const params = days.map(day => `daysOfWeek=${day}`).join('&');
    return this.http.get<MealPlan[]>(`${this.apiUrl}/findByMultipleDaysOfWeek?${params}`,{
      headers: this.headerService.getHeader(),
    });
  }

  // tsearchy bel userId we jour
  findByUserIdAndDay(userId: number, day: string): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(`${this.apiUrl}/findByUserIdAndDayOfWeek?userId=${userId}&dayOfWeek=${day}`,{
      headers: this.headerService.getHeader(),
    });
  }

  // tsearchy par plusieurs userIds et jours
  findByUserIdsAndDays(userIds: number[], days: string[]): Observable<MealPlan[]> {
    const userParams = userIds.map(id => `userIds=${id}`).join('&');
    const dayParams = days.map(day => `daysOfWeek=${day}`).join('&');
    return this.http.get<MealPlan[]>(`${this.apiUrl}/findByUserIdsAndDaysOfWeek?${userParams}&${dayParams}`,{
      headers: this.headerService.getHeader(),
    });
  }
}
