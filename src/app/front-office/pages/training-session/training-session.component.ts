import { Component, OnInit } from '@angular/core';
import { TrainingSessionService } from '../../../back-office/TrainingSessionMangment/services/TrainingSession.service';
@Component({
  selector: 'app-training-session',
  templateUrl: './training-session.component.html',
  styleUrls: ['./training-session.component.css']
})
export class TrainingSessionComponent implements OnInit {
  trainingSessions: any[] = [];


  constructor(private trainingSessionService: TrainingSessionService) {}

  ngOnInit(): void {
    this.loadTrainingSessions();
    console.log('Training sessions loaded:', this.trainingSessions);
  }

  loadTrainingSessions(): void {
    this.trainingSessionService.getTrainingSessions()
      .subscribe({
        next: (data) => this.trainingSessions = data,
        error: (error) => console.error('Error loading training sessions:', error)
      });
  }


}


