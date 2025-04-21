import { Component, OnInit } from '@angular/core';
import { ClubrequestsService } from '../services/Clubrequests.service';
import { ClubService } from '../../clubs-managment/services/club.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-club-request-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  requests: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private clubrequestService: ClubrequestsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadrequests();
  }

  loadrequests(): void {
    this.loading = true;
    this.clubrequestService.getPendingRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load requests';
        this.loading = false;
        console.error(error);
      }
    });
  }

  rejectRequest(id: number): void {
    if (confirm('Are you sure you want to reject this club request?')) {
      this.clubrequestService.rejectClubCreationRequest(id).subscribe({
        next: () => {
          this.loadrequests();
        },
        error: (error) => {
          this.errorMessage = 'Failed to reject club request';
          console.error(error);
        }
      });
    }
  }

  approveRequest(id: number): void {
    if (confirm('Are you sure you want to approve this club request?')) {
      this.clubrequestService.approveClubCreationRequest(id).subscribe({
        next: () => {
          this.loadrequests();
        },
        error: (error) => {
          this.errorMessage = 'Failed to approve club request';
          console.error(error);
        }
      });
    }
  }
  viewDocument(requestId: number): void {
    this.clubrequestService.getRequestDocument(requestId).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      },
      error: (error) => {
        console.error('Error fetching document:', error);
      }
    });
  }

}
