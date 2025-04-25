import { Component, OnInit } from '@angular/core';
import { ClubService } from '../services/club.service';
import { SportService } from '../../sports-managment/services/sports.service';
import { AbonnementService } from 'src/app/back-office/abonnement-managment/services/Abonnement.service'; // Ajoutez l'import
import { Router } from '@angular/router';

interface Club {
  id?: number;
  capacity?: number;
  name?: string;
  description?: string;
  status?: string;
  selectedSportId?: number | null;
  sports?: any[]; // Assuming sports is an array of objects
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
  performanceData: any = null;
  showPerformance: boolean = false; 


  constructor(
    private clubservice: ClubService,
    private sportservice: SportService,
    private abonnementService: AbonnementService,
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
        console.log(data);
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
 
  viewPerformance(clubId: number): void {
    console.log('Sending clubId:', clubId);
    this.abonnementService.analyzeClubPerformance(clubId).subscribe({
      next: (data) => {
        this.performanceData = data; // Stocker les données de performance
        console.log('Performance:', data);
        this.showPerformance = true; // Afficher la section de performance
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement de la performance du club.';
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
