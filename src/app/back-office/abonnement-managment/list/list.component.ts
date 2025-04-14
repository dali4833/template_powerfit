import { Component, OnInit } from '@angular/core';
import { AbonnementService } from '../services/Abonnement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-abonnements-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  abonnements: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private abonnementService: AbonnementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadabonnements();
  }

  loadabonnements(): void {
    this.loading = true;
    this.abonnementService.getAbonnements().subscribe({
      next: (data) => {
        this.abonnements = data;
        this.loading = false;
        console.log(data);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load abonnements';
        this.loading = false;
        console.error(error);
      }
    });
  }

  deleteAbonnement(id: number): void {
    if (confirm('Are you sure you want to delete this abonnement?')) {
      this.abonnementService.deleteAbonnement(id).subscribe({
        next: () => {
          this.loadabonnements();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete abonnement';
          console.error(error);
        }
      });
    }
  }

  editAbonnement(id: number): void {
    this.router.navigate(['/admin/abonnement-management', id, 'edit']);
  }

  validateabonnement(id: number): void {
    if (confirm('Are you sure you want to validate this abonnement?')) {
    this.abonnementService.validateAbonnement(id).subscribe({
      next: () => {
        this.loadabonnements();
      },
      error: (error) => {
        this.errorMessage = 'Failed to validate abonnement';
        console.error(error);
      }
    });

  }
}




}
