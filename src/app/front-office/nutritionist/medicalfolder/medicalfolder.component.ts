import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MedicalfolderService } from '../../services/medicalfolder.service';
import { MedicalFolder } from '../../models/Medicalfolder';
import { GenderStat } from 'src/app/front-office/models/GenderStat';
import { ChartType, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-medicalfolder',
  templateUrl: './medicalfolder.component.html',
  styleUrls: ['./medicalfolder.component.css']
})
export class MedicalfolderComponent implements OnInit {
  currentChildRoute: string | null = null;
  medicalfolders: MedicalFolder[] = [];
  activeTab: string = 'meetings';

  genderStats!: { [key: string]: GenderStat };
  maleCount = 0;
  femaleCount = 0;
  malePercentage = 0;
  femalePercentage = 0;

  // Variables pour le pie chart
  public pieChartLabels: string[] = ['Female', 'Male'];
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [{ data: [0, 0] }]
  };

  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#2e7d32',
          font: { size: 14 }
        }
      }
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private medicalfolderService: MedicalfolderService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const path = this.router.url;

        if (path.includes('addMedical')) {
          this.currentChildRoute = 'addMedical';
        } else if (path.includes('showMedicalfolder')) {
          this.currentChildRoute = 'show';
        } else if (path.includes('updateMedicalfolder')) {
          this.currentChildRoute = 'updateMedicalfolder';
        } else {
          this.currentChildRoute = null;
        }

        // Recharge les dossiers et statistiques quand on revient sur la liste principale
        if (!this.currentChildRoute) {
          this.loadMedicalFolders();
          this.loadGenderStats();
        }
      });

    // Chargement initial
    this.loadMedicalFolders();
    this.loadGenderStats();
  }

  loadMedicalFolders(): void {
    this.medicalfolderService.getAllDossiers().subscribe({
      next: (data) => this.medicalfolders = data,
      error: (err) => console.error('Erreur lors de la récupération des dossiers:', err)
    });
  }

  loadGenderStats(): void {
    this.medicalfolderService.getGenderStats().subscribe(data => {
      this.genderStats = data;
      this.maleCount = data['male']?.count || 0;
      this.femaleCount = data['female']?.count || 0;
      this.malePercentage = data['male']?.percentage || 0;
      this.femalePercentage = data['female']?.percentage || 0;

      // Mise à jour du camembert avec les pourcentages
      this.updateChart();
    });
  }

  updateChart(): void {
    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [
        {
          data: [this.femalePercentage, this.malePercentage],
          backgroundColor: ['#3d5a40', '#556b2f'],
          hoverBackgroundColor: ['#bfcab3', '#bfcab3']
        }
      ]
    };
  }

  goToShowMedicalfolder(id: number): void {
    this.router.navigate(['showMedicalfolder', id], { relativeTo: this.route });
  }

  editMedicalfolder(id: number): void {
    this.router.navigate(['updateMedicalfolder', id], { relativeTo: this.route });
  }

  goToNewMedical(): void {
    this.router.navigate(['addMedical'], { relativeTo: this.route });
  }

  goToMeetings(): void {
    this.activeTab = 'meetings';
    this.router.navigate(['/nutritionist/meeting']);
  }

  goToMedicalFolder(): void {
    this.activeTab = 'folder';
    this.router.navigate(['/nutritionist/medicalfolder']);
  }
  currentPage: number = 1;
itemsPerPage: number = 5;

get paginatedFolders() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.medicalfolders.slice(start, end);
}

get totalPages(): number {
  return Math.ceil(this.medicalfolders.length / this.itemsPerPage);
}

changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

}
