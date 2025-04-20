import { Component, OnInit } from '@angular/core';
import { TrainingSessionService } from '../services/TrainingSession.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  trainingSessions: any[] = [];

  constructor(private trainingSessionService: TrainingSessionService) {}

  ngOnInit(): void {
    this.loadTrainingSessions();
  }

  loadTrainingSessions(): void {
    this.trainingSessionService.getTrainingSessions()
      .subscribe({
        next: (data) => this.trainingSessions = data,
        error: (error) => console.error('Error loading training sessions:', error)
      });
  }

  deleteSession(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this session?')) {
      this.trainingSessionService.deleteTrainingSession(id)
        .subscribe({
          next: () => {
            this.trainingSessions = this.trainingSessions.filter(session => session.id !== id);
          },
          error: (error) => console.error('Error deleting training session:', error)
        });
    }
  }
}
