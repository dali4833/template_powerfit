import { Component, OnInit } from '@angular/core';
import { PackService } from '../services/pack.service';
import { Router } from '@angular/router';
import { ClubService } from '../../clubs-managment/services/club.service';
declare var bootstrap: any; // Add this for Bootstrap modal

@Component({
  selector: 'app-packs-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  packs: any[] = [];
  clubs: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  selectedClubId: string = '';
  selectedPack: any = null;
  private modal: any;

  constructor(
    private packservice: PackService,
    private clubservice: ClubService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadpacks();
  }

  loadpacks(): void {
    this.loading = true;
    this.packservice.getpacks().subscribe({
      next: (data) => {
        this.packs = data;
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
    this.loadClubs();
    const modalEl = document.getElementById('affectModal');
    if (modalEl) {
      this.modal = new (window as any).bootstrap.Modal(modalEl);
      this.modal.show();
    }
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
}
