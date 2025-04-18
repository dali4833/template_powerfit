import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbonnementService } from 'src/app/back-office/abonnement-managment/services/Abonnement.service';
import { AbonnementrequestsService } from 'src/app/back-office/abonnementrequests-mangment/services/Abonnementrequests.service';
import { ClubService } from 'src/app/back-office/clubs-managment/services/club.service';
import { PackService } from 'src/app/back-office/packs-managment/services/pack.service';
declare var bootstrap: any;


interface Pack{
  price : number;
  id : number;
  name : string;
  duration :  number;
  abonnements : any[] ;
  abonnementsrequests : any[] ;
  userIsSubscribed?: boolean;
  userHasRequested?: boolean;
  subscriptionCount?: number;
}

interface ClubPerformance {
  interpretation: string;
  packPerformance: Array<{
    subscriptionCount: number;
    packName: string;
  }>;
  renewalRate: number;
  message: string;
}

@Component({
  selector: 'app-clubs-packs',
  templateUrl: './clubs-packs.component.html',
  styleUrls: ['./clubs-packs.component.css']
})
export class ClubsPacksComponent implements OnInit, OnDestroy {

  clubs: any[] = [];
  loading = false;
  selectedClub: any | null = null;

  currentUserEmail = "test@hotmail.fr";
  startDate: string = '';
  endDate: string = '';
  selectedPackId: number | null = null;
  private dateModal: any;
  newEndDate: string = '';
  selectedAbonnementId: number | null = null;
  private renewModal: any;
  private lastFocusedElement: HTMLElement | null = null;

  constructor(
    private ClubService: ClubService,
    private AbonnementRequest : AbonnementrequestsService,
    private AbonnementService : AbonnementService
  ) { }

  ngOnInit(): void {
    this.loadClubs();
    // Initialize the date inputs with today's date
    const today = new Date();
    this.startDate = today.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  ngOnDestroy(): void {
    if (this.dateModal) {
      this.dateModal.dispose();
    }
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }

  loadClubs(): void {
    this.loading = true;
    this.ClubService.getClubs().subscribe({
      next: (clubs) => {
        this.clubs = clubs
          .filter(club => club.status === "APPROVED")
          .map(club => {
            const mappedClub = { ...club };
            
            // Load renewal rate and performance data
            this.AbonnementService.calculateRenewalRateForClub(club.id).subscribe(rate => {
              mappedClub.renewalRate = rate;
            });
            
            this.AbonnementService.analyzeClubPerformance(club.id).subscribe(performance => {
              mappedClub.performance = performance;
            });

            if (mappedClub.packs) {
              mappedClub.packs = mappedClub.packs.map((pack: Pack) => {
                const abonnements = pack.abonnements || [];
                const demandes = pack.abonnementsrequests || [];
                
                return {
                  ...pack,
                  userIsSubscribed: abonnements.some((a: any) => a.user?.email === this.currentUserEmail),
                  userHasRequested: demandes.some((r: any) => r.user?.email === this.currentUserEmail)
                };
              });
            }
            return mappedClub;
          });
        console.log(this.clubs);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => this.loading = false
    });
  }

  loadClubPacks(clubId: number): void {
    this.selectedClub = this.clubs.find(s => s.id === clubId);
  }

  closeModal(): void {
    this.selectedClub = null;
    const modalElement = document.getElementById('PackModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }

  subscribeToPack(packId: number) {
    this.lastFocusedElement = document.activeElement as HTMLElement;
    this.selectedPackId = packId;
    
    // Dispose existing modal if any
    if (this.dateModal) {
      this.dateModal.dispose();
    }
    
    // Create new modal instance
    this.dateModal = new bootstrap.Modal(document.getElementById('DateSelectionModal'));
    this.dateModal.show();
  }

  confirmSubscription() {
    if (!this.selectedPackId || !this.startDate || !this.endDate) {
      console.error('Missing required data');
      return;
    }

    const abonnementrequest: any = {
      startDate: this.startDate,
      endDate: this.endDate
    };

    this.AbonnementRequest.createRequest(abonnementrequest, this.selectedPackId).subscribe({
      next: (response) => {
        console.log('Subscription request created:', response);
        this.loadClubs();
        if (this.dateModal) {
          this.dateModal.hide();
        }
        // Reset the form
        this.selectedPackId = null;
        const today = new Date();
        this.startDate = today.toISOString().split('T')[0];
        this.endDate = today.toISOString().split('T')[0];
        if (this.lastFocusedElement) {
          this.lastFocusedElement.focus();
          this.lastFocusedElement = null;
        }
      },
      error: (error) => {
        console.error('Error creating subscription request:', error);
      }
    });
  }

  isEligibleForRenewal(pack: any): boolean {
    const abonnement = pack.abonnements.find((a: any) => a.user?.email === this.currentUserEmail);
    if (!abonnement) return false;
    
    const endDate = new Date(abonnement.endDate);
    const today = new Date();
    return endDate < today;
  }

  openRenewModal(pack: any) {
    this.lastFocusedElement = document.activeElement as HTMLElement;
    const abonnement = pack.abonnements.find((a: any) => a.user?.email === this.currentUserEmail);
    if (!abonnement) return;

    this.selectedAbonnementId = abonnement.id;
    
    // Initialize with tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.newEndDate = tomorrow.toISOString().split('T')[0];
    
    // Create new modal instance
    this.renewModal = new bootstrap.Modal(document.getElementById('RenewModal'));
    this.renewModal.show();
  }

  confirmRenewal() {
    if (!this.selectedAbonnementId || !this.newEndDate) {
      console.error('Missing required data');
      return;
    }

    this.AbonnementService.renewAbonnement(this.selectedAbonnementId, this.newEndDate).subscribe({
      next: (response) => {
        console.log('Subscription renewed:', response);
        this.loadClubs();
        if (this.renewModal) {
          this.renewModal.hide();
        }
        // Reset the form
        this.selectedAbonnementId = null;
        this.newEndDate = '';
        if (this.lastFocusedElement) {
          this.lastFocusedElement.focus();
          this.lastFocusedElement = null;
        }
      },
      error: (error) => {
        console.error('Error renewing subscription:', error);
      }
    });
  }
}


