import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewService } from '../services/Review.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  reviews: any[] = [];
  loading = false;
  errorMessage = '';
  sessionId = 1; // You might want to get this from a route parameter or service

  constructor(
    private reviewService: ReviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.reviewService.getReviews(this.sessionId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load reviews';
        this.loading = false;
        console.error(error);
      }
    });
  }

  deleteReview(reviewId: number): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(this.sessionId, reviewId).subscribe({
        next: () => {
          this.loadReviews();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete review';
          console.error(error);
        }
      });
    }
  }
}
