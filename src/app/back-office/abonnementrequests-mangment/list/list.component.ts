import { Component, OnInit } from '@angular/core';
import { AbonnementrequestsService } from '../services/Abonnementrequests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sports-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  requests: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private abonnementreqsevice: AbonnementrequestsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.abonnementreqsevice.getRequests().subscribe({
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

  approveRequest(requestId: number): void {
    this.abonnementreqsevice.approveRequest(requestId).subscribe({
      next: () => {
        this.loadRequests();
      },
      error: (error) => {
        this.errorMessage = 'Failed to approve request';
        console.error(error);
      }
    });
  }


}
