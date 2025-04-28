import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../services/Review.service';

@Component({
  selector: 'app-editadd',
  templateUrl: './editadd.component.html'
})
export class EditaddComponent implements OnInit {
  form: FormGroup;
  isEditing = false;
  loading = false;
  errorMessage = '';
  reviewId: number | null = null;
  sessionId = 1;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.reviewId = +id;
      this.loadReview();
    }
  }

  loadReview(): void {
    if (!this.reviewId) return;

    this.loading = true;
    this.reviewService.getReviewById(this.sessionId, this.reviewId).subscribe({
      next: (review) => {
        this.form.patchValue(review);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load review';
        this.loading = false;
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const review = this.form.value;

    const operation = this.isEditing && this.reviewId
      ? this.reviewService.updateReview(this.sessionId, this.reviewId, review)
      : this.reviewService.createReview(this.sessionId, review);

    operation.subscribe({
      next: () => {
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (error) => {
        this.errorMessage = `Failed to ${this.isEditing ? 'update' : 'create'} review`;
        this.loading = false;
        console.error(error);
      }
    });
  }
}
