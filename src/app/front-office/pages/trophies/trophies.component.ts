import { Component, OnInit } from '@angular/core';
import { TrophyService } from '../../../back-office/trophiesManagement/services/Trophy.service';

@Component({
  selector: 'app-trophies',
  templateUrl: './trophies.component.html',
  styleUrls: ['./trophies.component.css']
})
export class TrophiesComponent implements OnInit {
  trophies: any[] = [];
  userTrophies: any[] = [];
  userPoints: number = 0;
  loading: boolean = false;
  sortDirection: 'asc' | 'desc' = 'asc';
  showMyTrophies: boolean = false;

  constructor(
    private trophyService: TrophyService,
    
  ) {}

  ngOnInit(): void {
    this.loadTrophies();
    this.loadUserPoints();
  }

  loadTrophies(): void {
    this.loading = true;
    this.trophyService.getTrophies().subscribe({
      next: (trophies) => {
        this.trophies = trophies;
        this.sortTrophies();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading trophies:', error);
        this.loading = false;
      }
    });
  }

  loadUserPoints(): void {
    this.trophyService.getUserPoints().subscribe({
      next: (data) => {
        console.log(data)
        this.userPoints = data.points;
        this.userTrophies = data.trophies || [];
      },
      error: (error) => console.error('Error loading user points:', error)
    });
  }

  sortTrophies(): void {
    this.trophies.sort((a, b) => {
      const compareValue = a.requiredPoints - b.requiredPoints;
      return this.sortDirection === 'asc' ? compareValue : -compareValue;
    });
  }

  toggleSort(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortTrophies();
  }

  isTrophyClaimed(trophyId: number): boolean {
    return this.userTrophies.some(t => t.id === trophyId);
  }

  getPointsNeeded(requiredPoints: number): number {
    return Math.max(0, requiredPoints - this.userPoints);
  }
}
