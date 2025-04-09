import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../services/Booking.service';

@Component({
  selector: 'app-booking-add',
  templateUrl: './editadd.component.html'
})
export class EditaddComponent implements OnInit {
  bookingForm: FormGroup;
  loading = false;
  errorMessage = '';
  trainingSessions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      trainingSessionId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTrainingSessions();
  }

  loadTrainingSessions(): void {
    this.loading = true;
    this.bookingService.getTrainingSessions().subscribe({
      next: (sessions) => {
        this.trainingSessions = sessions;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load training sessions';
        this.loading = false;
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) return;

    this.loading = true;
    const sessionId = this.bookingForm.value.trainingSessionId;
    const bookingData = {
      status: 'PENDING'
    };

    this.bookingService.createBooking(sessionId, bookingData).subscribe({
      next: () => {
        this.router.navigate(['/admin/Booking-management']);
      },
      error: (error) => {
        this.errorMessage = 'Failed to create booking';
        this.loading = false;
        console.error(error);
      }
    });
  }
}
