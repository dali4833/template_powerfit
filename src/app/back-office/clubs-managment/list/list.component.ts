import { Component, OnInit } from '@angular/core';
import { ClubService } from '../services/club.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clubs-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  clubs: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private clubservice: ClubService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.loading = true;
    this.clubservice.getClubs().subscribe({
      next: (data) => {
        this.clubs = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load clubs';
        this.loading = false;
        console.error(error);
      }
    });
  }

  deleteClub(id: number): void {
    if (confirm('Are you sure you want to delete this club?')) {
      this.clubservice.deleteClub(id).subscribe({
        next: () => {
          this.loadClubs();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete club';
          console.error(error);
        }
      });
    }
  }

  editClub(id: number): void {
    this.router.navigate(['/admin/clubs-management', id, 'edit']);
  }
}
