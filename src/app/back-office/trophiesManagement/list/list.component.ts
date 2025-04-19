import { Component, OnInit } from '@angular/core';
import { TrophyService } from '../services/Trophy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trophy-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  Trophies: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private trophyService: TrophyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrophies();
  }

  loadTrophies(): void {
    this.loading = true;
    this.trophyService.getTrophies().subscribe({
      next: (data) => {
        this.Trophies = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load trophies';
        this.loading = false;
      }
    });
  }

  deleteTrophy(id: number): void {
    if (confirm('Are you sure you want to delete this trophy?')) {
      this.trophyService.deleteTrophy(id).subscribe({
        next: () => {
          this.loadTrophies();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete trophy';
        }
      });
    }
  }
}
