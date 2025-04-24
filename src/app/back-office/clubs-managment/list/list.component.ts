import { Component, OnInit } from '@angular/core';
import { ClubService } from '../services/club.service';
import { SportService } from '../../sports-managment/services/sports.service';
import { Router } from '@angular/router';

interface Club {
  id?: number;
  capacity?: number;
  name?: string;
  description?: string;
  status?: string;
  selectedSportId?: number | null;
}

@Component({
  selector: 'app-clubs-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  clubs: Club[] = [];
  sports: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private clubservice: ClubService,
    private sportservice: SportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClubs();
    this.loadSports();
  }

  loadClubs(): void {
    this.loading = true;
    this.clubservice.getClubs().subscribe({
      next: (data) => {
        this.clubs = data.map(club => ({...club, selectedSportId: null}));
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load clubs';
        this.loading = false;
        console.error(error);
      }
    });
  }

  loadSports(): void {
    this.sportservice.getSports().subscribe({
      next: (data) => {
        this.sports = data;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load sports';
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

  affecttosport(clubId: any, sportId: any): void {
    if (!sportId) {
      this.errorMessage = 'Please select a sport';
      return;
    }
    
    this.clubservice.affecterSportToClub(clubId, sportId).subscribe({
      next: () => {
        this.loadClubs();
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Failed to affect sport to club';
        console.error(error);
      }
    });
  }

  editClub(id: number): void {
    this.router.navigate(['/admin/clubs-management', id, 'edit']);
  }
}
