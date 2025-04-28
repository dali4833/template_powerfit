import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../services/Booking.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  bookings: any[] = [];
  loading = false;
  errorMessage = '';
  sessionId = 8;
  coachesallbookings: any[] = [];

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBookingsByCoachId();
  }

  // loadBookings(): void {
  //   this.loading = true;
  //   this.bookingService.getBookings(this.sessionId).subscribe({
  //     next: (data) => {
  //       this.bookings = data;
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       this.errorMessage = 'Failed to load bookings';
  //       this.loading = false;
  //       console.error(error);
  //     }
  //   });
  // }

  approveBooking(bookingId: number): void {
    console.log('Approving booking with ID:', bookingId);
    console.log('Session ID:', this.sessionId);
    if (confirm('Are you sure you want to approve this booking?')) {
      this.bookingService.approveBooking(this.sessionId, bookingId).subscribe({
        next: () => {
          this.getBookingsByCoachId();
        },
        error: (error) => {
          this.errorMessage = 'Failed to approve booking';
          console.error(error);
        }
      });
    }
  }

  rejectBooking(bookingId: number): void {
    if (confirm('Are you sure you want to reject this booking?')) {
      this.bookingService.rejectBooking(this.sessionId, bookingId).subscribe({
        next: () => {
          this.getBookingsByCoachId();
        },
        error: (error) => {
          this.errorMessage = 'Failed to reject booking';
          console.error(error);
        }
      });
    }
  }

  cancelBooking(bookingId: number): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(this.sessionId, bookingId).subscribe({
        next: () => {
          this.getBookingsByCoachId();
        },
        error: (error) => {
          this.errorMessage = 'Failed to cancel booking';
          console.error(error);
        }
      });
    }
  }


  getBookingsByCoachId(): void {
    this.bookingService.getBookingsByCoachId().subscribe({
      next: (data) => {
        this.bookings = data;
        console.log(this.bookings);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load bookings by coach ID';
        console.error(error);
      }
    });


  }





}
