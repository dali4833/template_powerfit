import { Component, OnInit } from '@angular/core';
import { PackService } from '../services/pack.service';
import { Router } from '@angular/router';
import { ClubService } from '../../clubs-managment/services/club.service';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
declare var bootstrap: any; // Add this for Bootstrap modal

@Component({
  selector: 'app-packs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  packs: any[] = [];
  clubs: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  selectedClubId: string = '';
  selectedPack: any = null;
  private modal: any;
  
  // Add new properties for statistics and popularity
  statistics: any = null;
  popularPacks: any[] = [];
  statisticsLoading: boolean = false;
  popularityLoading: boolean = false;

  constructor(
    private packservice: PackService,
    private clubservice: ClubService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadpacks();
    this.loadClubs();
    this.loadStatistics();
    this.loadPopularPacks();
  }

  loadpacks(): void {
    this.loading = true;
    this.packservice.getpacks().subscribe({
      next: (data) => {
        
        this.packs = data;
        
        this.packs.forEach(pack => {
          this.packservice.doespackhaveclub(pack.id).subscribe({
            next: (hasClub) => {
              pack.hasClub = hasClub;
            },
            error: (error) => {
              console.error(`Error checking if pack ${pack.id} has club:`, error);
              pack.hasClub = false;
            }
          });
        });
        
        console.log("Packs after checking clubs:", this.packs);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load packs';
        this.loading = false;
        console.error(error);
      }
    });
  }

  loadClubs(): void {
    this.loading = true;
    this.clubservice.getClubs().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.clubs = data;
        } else {
          console.error("Unexpected data format for clubs:", data);
          this.clubs = []; 
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load clubs';
        this.loading = false;
        console.error("Error loading clubs:", error);
        this.clubs = [];
      }
    });
  }

  deletePack(id: number): void {
    if (confirm('Are you sure you want to delete this pack?')) {
      this.packservice.deletepack(id).subscribe({
        next: () => {
          this.loadpacks();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete pack';
          console.error(error);
        }
      });
    }
  }

  editPack(id: number): void {
    this.router.navigate(['/admin/packs-management', id, 'edit']);
  }

  affectPackToClub(packId: number, clubId: number): void {
    this.packservice.affecterPackToclub(packId, clubId).subscribe({
      next: () => {
        alert('Pack successfully affected to club');
      },
      error: (error) => {
        this.errorMessage = 'Failed to affect pack to club';
        console.error(error);
      }
    });
  }

  openAffectModal(pack: any): void {
    this.selectedPack = pack;
    this.selectedClubId = '';
    
    // Use the same method as loadClubs for consistency
    this.clubservice.getClubs().subscribe({
      next: (data) => {
        console.log("Modal clubs data received:", data);
        if (data && Array.isArray(data)) {
          this.clubs = data;
        } else {
          console.error("Unexpected data format for clubs in modal:", data);
          this.clubs = []; 
        }
        
        setTimeout(() => {
          const modalEl = document.getElementById('affectModal');
          if (modalEl) {
            this.modal = new bootstrap.Modal(modalEl);
            this.modal.show();
          } else {
            console.error("Modal element not found");
          }
        }, 0);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load clubs';
        console.error("Error loading clubs for modal:", error);
        this.clubs = []; // Initialize as empty array on error
        
        // Show modal even if clubs failed to load
        setTimeout(() => {
          const modalEl = document.getElementById('affectModal');
          if (modalEl) {
            this.modal = new bootstrap.Modal(modalEl);
            this.modal.show();
          } else {
            console.error("Modal element not found");
          }
        }, 0);
      }
    });
  }

  closeModal(): void {
    if (this.modal) {
      this.modal.hide();
    }
  }

  confirmAffectToClub(): void {
    if (this.selectedPack && this.selectedClubId) {
      this.packservice.affecterPackToclub(this.selectedPack.id, Number(this.selectedClubId)).subscribe({
        next: () => {
          this.closeModal();
          alert('Pack successfully affected to club');
          this.loadpacks(); // Reload the packs after successful affectation
        },
        error: (error) => {
          this.errorMessage = 'Failed to affect pack to club';
          console.error(error);
        }
      });
    }
  }

  // Replace the hasClub method with one that uses the pack.hasClub property
  hasClub(pack: any): boolean {
    return pack && (pack.hasClub === true || (pack.club && pack.club.name));
  }

  loadStatistics(): void {
    this.statisticsLoading = true;
    this.packservice.getPacksPopularityStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
        this.statisticsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load statistics:', error);
        this.statisticsLoading = false;
      }
    });
  }

  loadPopularPacks(): void {
    this.popularityLoading = true;
    this.packservice.getPopularPacks().subscribe({
      next: (data) => {
        this.popularPacks = data;
        this.popularityLoading = false;
      },
      error: (error) => {
        console.error('Failed to load popular packs:', error);
        this.popularityLoading = false;
      }
    });
  }

  // Helper to get colors based on position for visualizations
  getPositionColor(index: number): string {
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#4682B4', '#708090']; // Gold, Silver, Bronze, etc.
    return index < colors.length ? colors[index] : '#A9A9A9';
  }
}
