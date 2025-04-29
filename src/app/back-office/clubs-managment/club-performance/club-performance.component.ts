import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbonnementService } from '../../abonnement-managment/services/Abonnement.service';

@Component({
  selector: 'app-club-performance',
  templateUrl: './club-performance.component.html'
})
export class ClubPerformanceComponent implements OnInit {
  performanceData: any = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private abonnementService: AbonnementService
  ) {}

  ngOnInit(): void {
    const clubId = +this.route.snapshot.paramMap.get('clubId')!;
    this.abonnementService.analyzeClubPerformance(clubId).subscribe({
      next: data => {
        this.performanceData = data;
      },
      error: err => {
        this.errorMessage = "Erreur lors de la récupération des performances.";
      }
    });
  }
}
