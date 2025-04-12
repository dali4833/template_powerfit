import { Component, OnInit } from '@angular/core';
import { TrainingSessionService } from '../../../back-office/TrainingSessionMangment/services/TrainingSession.service';
import { BookingService } from 'src/app/back-office/BookingManagment/services/Booking.service';
import { ReviewService } from 'src/app/back-office/ReviewManagment/services/Review.service';

interface TrainingSession {
  id: number;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: number;
  sport: string;
  isBooked: boolean;
  bookingId?: number;
}

@Component({
  selector: 'app-training-session',
  templateUrl: './training-session.component.html',
  styleUrls: ['./training-session.component.css']
})
export class TrainingSessionComponent implements OnInit {
  trainingSessions: TrainingSession[] = [];
  loading = false;

  constructor(
    private trainingSessionService: TrainingSessionService,
    private bookingService: BookingService,
    private reviewService: ReviewService,
  ) { }

  ngOnInit(): void {
    this.loadTrainingSessions();
  }

  loadTrainingSessions(): void {
    this.loading = true;
    this.trainingSessionService.getTrainingSessions().subscribe({
      next: (sessions) => {
        this.trainingSessions = sessions.map(session => ({
          ...session,
          isBooked: false,
          currentParticipants: 0
        }));
        this.loadBookingsForSessions();
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => this.loading = false
    });
  }

  private loadBookingsForSessions(): void {
    this.trainingSessions.forEach(session => {
      this.bookingService.getBookings(session.id).subscribe({
        next: (bookings) => {
          const userBooking = bookings.find((b: any) => b.trainingSession.id === session.id);
          if (userBooking) {
            session.isBooked = true;
            session.bookingId = userBooking.id;
          }
        },
        error: (error) => console.error('Error loading bookings:', error)
      });
    });
  }

  bookSession(sessionId: number): void {
    this.loading = true;
    this.bookingService.createBooking(sessionId).subscribe({
      next: () => {
        this.loadTrainingSessions();
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => this.loading = false
    });
  }

  cancelBooking(sessionId: number, bookingId: number): void {
    this.loading = true;
    this.bookingService.cancelBooking(sessionId, bookingId).subscribe({
      next: () => {
        this.loadTrainingSessions();
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => this.loading = false
    });
  }

  checkExercises(sessionId: number): void {
    // Implement exercise check logic
  }

  loadReviews(sessionId: number): void {
    // Implement review loading logic
  }




}


