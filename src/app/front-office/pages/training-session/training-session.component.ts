  import { Component, OnInit } from '@angular/core';
  import { TrainingSessionService } from '../../../back-office/TrainingSessionMangment/services/TrainingSession.service';
  import { BookingService } from 'src/app/back-office/BookingManagment/services/Booking.service';
  import { ReviewService } from 'src/app/back-office/ReviewManagment/services/Review.service';
  declare var bootstrap: any;
  import { CommonModule } from '@angular/common';

  interface Review {
    id: number;
    rating: number;
    description: string;
    createdAt: Date;
    user: {
      name: string;
      email: string;
    };
  }
  interface Coach {
    id: number;
    name: string;
    email: string;
    averageRating: number;
    reviewCount: number;
  }

  interface Booking {
    id: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Match the enum from the backend
    user: {
      name: string;
      email: string;
    };
    trainingSession: {
      id: number;
    };
    bookedAt: Date;
    resolvedAt?: Date;
  }


  interface TrainingSession {
    id: number;
    description: string;
    date: Date;
    startTime: string;
    endTime: string;
    maxParticipants: number;
    currentParticipants: number;
    sport: string;
    meetLink: string;
    isBooked: boolean;
    bookingId?: number;
    isElapsed?: boolean;
    bookings?: any[]; //
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    canReview?: boolean;
    reviews?: Review[];
    selectedReviews?: Review[];
  }

  @Component({
    selector: 'app-training-session',
    templateUrl: './training-session.component.html',
    styleUrls: ['./training-session.component.css']
  })
  export class TrainingSessionComponent implements OnInit {
    trainingSessions: TrainingSession[] = [];
    loading = false;
    selectedSession: TrainingSession | null = null;
    selectedRating = 0;
    reviewText = '';
    recommendedCoaches: Coach[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 3;

    constructor(
      private trainingSessionService: TrainingSessionService,
      private bookingService: BookingService,
      private reviewService: ReviewService,
    ) { }

    ngOnInit(): void {
      this.loadTrainingSessions();
      this.loadRecommendedCoaches();
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
          this.loadReviewsForSessions();
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => this.loading = false
      });
    }

    private loadBookingsForSessions(): void {
      this.trainingSessions.forEach(session => {
        const sessionDate = new Date(session.date);
        const [hours, minutes] = session.endTime.split(':');
        sessionDate.setHours(parseInt(hours), parseInt(minutes));
        session.isElapsed = new Date() > sessionDate;

        this.bookingService.getBookings(session.id).subscribe({
          next: (bookings: Booking[]) => {
            session.bookings = bookings; // Store bookings and their statuses
            const userBooking = bookings.find((b: Booking) => b.trainingSession.id === session.id );
            if (userBooking) {
              session.isBooked = true;
              session.bookingId = userBooking.id;
              session.status = userBooking.status;
              session.canReview = session.isElapsed && userBooking.status === 'APPROVED';
            }
          },
          error: (error) => console.error('Error loading bookings:', error)
        });
      });
    }

    private loadReviewsForSessions(): void {
      this.trainingSessions.forEach(session => {
        this.reviewService.getReviews(session.id).subscribe({
          next: (reviews) => {
            session.reviews = reviews;
            console.log(session)
          }
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
    }

    loadReviews(sessionId: number): void {
      const session = this.trainingSessions.find(s => s.id === sessionId);
      if (session) {
        this.selectedSession = session;
      }
    }

    getStarsArray(rating: number): number[] {
      return Array(rating).fill(0);
    }

    setRating(rating: number): void {
      this.selectedRating = rating;
    }

    isRatingSelected(rating: number): boolean {
      return rating <= this.selectedRating;
    }

    submitReview(): void {
      if (!this.selectedSession || this.selectedRating === 0 || !this.reviewText.trim()) {
        return;
      }

      const review = {
        rating: this.selectedRating,
        description: this.reviewText.trim()
      };

      this.reviewService.createReview(this.selectedSession.id, review).subscribe({
        next: () => {
          this.selectedRating = 0;
          this.reviewText = '';

          this.reviewService.getReviews(this.selectedSession!.id).subscribe({
            next: (reviews) => {
              if (this.selectedSession) {
                this.selectedSession.reviews = reviews;
                const sessionIndex = this.trainingSessions.findIndex(s => s.id === this.selectedSession!.id);
                if (sessionIndex !== -1) {
                  this.trainingSessions[sessionIndex].reviews = reviews;
                }
              }
            }
          });
        },
        error: (error) => {
          console.error('Error submitting review:', error);
        }
      });
    }

    closeModal(): void {
      this.selectedSession = null;
      this.selectedRating = 0;
      this.reviewText = '';
      const modalElement = document.getElementById('reviewsModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }

    loadRecommendedCoaches(): void {  // Step 3: Fetch the recommended coaches
      this.trainingSessionService.getRecommendedCoaches().subscribe({
        next: (coaches) => {
          this.recommendedCoaches = coaches;  // Store the recommended coaches
        },
        error: (error) => {
          console.error('Error loading recommended coaches:', error);
        }
      });
    }

    get totalPages(): number {
      return Math.ceil(this.trainingSessions.length / this.itemsPerPage);
    }

    previousPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }

    nextPage(): void {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }

    setPage(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }

    getPages(): number[] {
      const maxVisiblePages = 5;
      let startPage = 1;
      let endPage = this.totalPages;

      if (this.totalPages > maxVisiblePages) {
        const halfVisible = Math.floor(maxVisiblePages / 2);
        startPage = Math.max(1, this.currentPage - halfVisible);
        endPage = startPage + maxVisiblePages - 1;

        if (endPage > this.totalPages) {
          endPage = this.totalPages;
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
      }

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }
  }


