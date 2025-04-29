import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewService } from '../services/Review.service';
import { TrainingSessionService } from '../../TrainingSessionMangment/services/TrainingSession.service';
import { forkJoin } from 'rxjs';

interface TrainingSession {
  id: number;
  description: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  maxParticipants?: number;
  sport?: number;
  meetLink?: string;
}

interface Review {
  id?: number;
  rating: number;
  description: string;
  createdAt: string;
  trainingSession: TrainingSession;
  user?: any;
}

interface SessionStats {
  sessionId: number;
  sessionDescription: string;
  totalReviews: number;
  positiveReviews: number;
  negativeReviews: number;
  sessionDate?: string;
  reviews: Review[];
  expanded: boolean;
}

interface RatingDistribution {
  rating: number;
  count: number;
}

interface LegendItem {
  color: string;
  label: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  reviews: Review[] = [];
  loading = false;
  errorMessage = '';
  sessionId = 1; 
  sessionStats: SessionStats[] = [];
  coachesSessions: TrainingSession[] = [];
  activeView: string = 'list';
  
  // Chart specific properties
  ratingDistribution: RatingDistribution[] = [];
  maxRatingCount: number = 0;
  maxSessionReviews: number = 0;
  ratingLegend: LegendItem[] = [
    { color: '#dc3545', label: 'Poor (1)' },
    { color: '#ffc107', label: 'Fair (2)' },
    { color: '#6c757d', label: 'Average (3)' },
    { color: '#17a2b8', label: 'Good (4)' },
    { color: '#28a745', label: 'Excellent (5)' }
  ];

  // Make Math available to the template
  Math = Math;
  
  constructor(
    private reviewService: ReviewService,
    private TrainingSessionService: TrainingSessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    
    // Use forkJoin to fetch both training sessions and reviews in parallel
    forkJoin({
      sessions: this.TrainingSessionService.getTrainingSessionsByCoach(),
      reviews: this.reviewService.getReviewsByCoachId() 
    }).subscribe({
      next: (results) => {
        this.coachesSessions = results.sessions;
        this.reviews = results.reviews;
        
        // Process the data after both are loaded
        this.processReviewStats();
        this.prepareChartData();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load data';
        this.loading = false;
        console.error(error);
      }
    });
  }

  processReviewStats(): void {
    if (!this.coachesSessions || this.coachesSessions.length === 0) {
      this.errorMessage = 'No training sessions found';
      return;
    }

    // Create a Map to store all sessions with their reviews
    const sessionMap = new Map<number, { session: TrainingSession, reviews: Review[] }>();
    
    // First add all training sessions to the map
    this.coachesSessions.forEach(session => {
      sessionMap.set(session.id, { session, reviews: [] });
    });
    
    // Then add all reviews to their respective sessions based on the trainingSession.id attribute
    if (this.reviews && this.reviews.length > 0) {
      this.reviews.forEach(review => {
        // Make sure review and trainingSession are properly defined
        if (review && review.trainingSession && review.trainingSession.id) {
          const sessionId = review.trainingSession.id;
          
          // Check if we have this session in our map
          if (sessionMap.has(sessionId)) {
            sessionMap.get(sessionId)?.reviews.push(review);
          } else {
            // If not, it might be a session we don't have in coachesSessions
            // Add it to our map using the training session data from the review
            sessionMap.set(sessionId, { 
              session: review.trainingSession, 
              reviews: [review] 
            });
          }
        }
      });
    }
    
    // Create stats for each session
    this.sessionStats = Array.from(sessionMap.entries()).map(([sessionId, data]) => {
      const { session, reviews } = data;
      // Count positive reviews (rating > 2)
      const positiveReviews = reviews.filter(review => review.rating > 2).length;
      
      return {
        sessionId,
        sessionDescription: session.description || `Session ${sessionId}`, // Fallback if description is missing
        sessionDate: session.date,
        totalReviews: reviews.length,
        positiveReviews,
        negativeReviews: reviews.length - positiveReviews,
        reviews: reviews,
        expanded: false
      };
    });

    console.log('Processed session stats:', this.sessionStats);
  }

  toggleSession(session: SessionStats): void {
    // Close all other sessions
    this.sessionStats.forEach(s => {
      if (s.sessionId !== session.sessionId) {
        s.expanded = false;
      }
    });
    
    // Toggle the selected session
    session.expanded = !session.expanded;
  }

  deleteReview(reviewId: number): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(this.sessionId, reviewId).subscribe({
        next: () => {
          // After deleting, refresh the reviews
          this.refreshReviews();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete review';
          console.error(error);
        }
      });
    }
  }

  refreshReviews(): void {
    this.loading = true;
    this.reviewService.getReviewsByCoachId().subscribe({
      next: (data) => {
        this.reviews = data;
        this.processReviewStats();
        this.prepareChartData();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to refresh reviews';
        this.loading = false;
        console.error(error);
      }
    });
  }

  // Set active view method
  setActiveView(view: string): void {
    this.activeView = view;
  }

  prepareChartData(): void {
    this.ratingDistribution = [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 0 },
      { rating: 5, count: 0 }
    ];

    this.reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        this.ratingDistribution[review.rating - 1].count++;
      }
    });

    this.maxRatingCount = Math.max(
      ...this.ratingDistribution.map(item => item.count),
      1 
    );
    
    this.maxSessionReviews = Math.max(
      ...this.sessionStats.map(session => session.totalReviews),
      1 
    );
  }

  getRatingColor(rating: number): string {
    switch(rating) {
      case 1: return '#dc3545'; 
      case 2: return '#ffc107'; 
      case 3: return '#6c757d'; 
      case 4: return '#17a2b8'; 
      case 5: return '#28a745';
      default: return '#ced4da';
    }
  }
}
