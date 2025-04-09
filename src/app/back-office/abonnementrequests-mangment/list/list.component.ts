import { Component, OnInit } from '@angular/core';
import { SportService } from '../services/sports.service';
import { Sport } from '../models/sport';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sports-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  sports: Sport[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private sportService: SportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSports();
  }

  loadSports(): void {
    this.loading = true;
    this.sportService.getSports().subscribe({
      next: (data) => {
        this.sports = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load sports';
        this.loading = false;
        console.error(error);
      }
    });
  }

  deleteSport(id: number): void {
    if (confirm('Are you sure you want to delete this sport?')) {
      this.sportService.deleteSport(id).subscribe({
        next: () => {
          this.loadSports();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete sport';
          console.error(error);
        }
      });
    }
  }

  editSport(id: number): void {
    this.router.navigate(['/admin/sports-management', id, 'edit']);
  }
}
