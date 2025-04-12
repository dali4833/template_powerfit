import { Component, OnInit } from '@angular/core';
import { TrainingSessionService } from '../../../back-office/TrainingSessionMangment/services/TrainingSession.service';

interface TrainingSession {
  id: number;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  coachName: string;
  sport: string;
  image: string;
}

@Component({
  selector: 'app-training-session',
  templateUrl: './training-session.component.html',
  styleUrls: ['./training-session.component.css']
})
export class TrainingSessionComponent implements OnInit {
  trainingSessions: TrainingSession[] = [];

  constructor(private trainingSessionService: TrainingSessionService) {}

  ngOnInit(): void {
    this.loadTrainingSessions();
  }

  loadTrainingSessions(): void {
    this.trainingSessionService.getTrainingSessions()
      .subscribe({
        next: (data) => {this.trainingSessions = data
          console.log('Training sessions loaded:', this.trainingSessions);
        },
        error: (error) => console.error('Error loading training sessions:', error)
      });
  }

  bookSession(sessionId: number): void {
    console.log('Booking session:', sessionId);
  }

  loadReviews(sessionId: number): void {
    console.log('Loading reviews for session:', sessionId);
  }

  CheckExercices(sessionId: number): void {
    console.log('Checking exercises for session:', sessionId);
  }
}


