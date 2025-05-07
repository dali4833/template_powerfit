import {Component, numberAttribute} from '@angular/core';
import { ExerciseRecommendationService } from 'src/app/front-office/exercice-recommendation/exercice-recommendation.service';

@Component({
  selector: 'app-exercice-recommendation',
  templateUrl: './exercice-recommendation.component.html',
  styleUrls: ['./exercice-recommendation.component.css']
})
export class ExerciceRecommendationComponent {
  formData = {
    target: '',
    level: '',
    equipment: ''
  };
  recommendations: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private exerciseService: ExerciseRecommendationService) {}

  async getRecommendations() {
    if (!this.formData.target || !this.formData.level || !this.formData.equipment ) {
      this.errorMessage = 'Please fill all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.recommendations = [];

    // Add artificial delay to simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 5000));

    this.exerciseService.getRecommendations(
      this.formData.target,
      this.formData.level,
      this.formData.equipment
    ).subscribe({
      next: (data) => {
        this.recommendations = Array.isArray(data) ? data : [data];
        this.recommendations = this.recommendations.map(exercise => ({
          ...exercise,
          imageLoaded: false
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to get recommendations';
        this.isLoading = false;
      }
    });
  }
}
