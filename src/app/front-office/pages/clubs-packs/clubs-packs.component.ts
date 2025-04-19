import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbonnementService } from 'src/app/back-office/abonnement-managment/services/Abonnement.service';
import { AbonnementrequestsService } from 'src/app/back-office/abonnementrequests-mangment/services/Abonnementrequests.service';
import { ClubService } from 'src/app/back-office/clubs-managment/services/club.service';
import { PackService } from 'src/app/back-office/packs-managment/services/pack.service';
declare var bootstrap: any;


interface Pack {
  price: number;
  id: number;
  name: string;
  duration: number;
  abonnements: any[];
  abonnementsrequests: any[];
  userIsSubscribed?: boolean;
  userHasRequested?: boolean;
  subscriptionCount?: number;
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
  newEndDate: string = '';
  selectedAbonnementId: number | null = null;
  private lastFocusedElement: HTMLElement | null = null;

  modalMode: 'subscribe' | 'renew' = 'subscribe';
  modalTitle: string = '';
  private actionModal: any;

  recommendedClubs: any[] = [];

  constructor(
    private ClubService: ClubService,
    private AbonnementRequest: AbonnementrequestsService,
    private AbonnementService: AbonnementService
  ) { }

  ngOnInit(): void {
    this.loadClubs();
    this.loadRecommendations();
    // Initialize the date inputs with today's date
    const today = new Date();
    this.startDate = today.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  ngOnDestroy(): void {
    this.closeModals();
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
                  userHasRequested: demandes.some((r: any) => r.user?.email === this.currentUserEmail),
                  subscriptionCount: abonnements.length
                };
              }).sort((a: Pack, b: Pack) => (b.subscriptionCount || 0) - (a.subscriptionCount || 0)); // Sort by subscription count
            }
            return mappedClub;
          });
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => this.loading = false
    });
  }

  loadRecommendations(): void {
    // Get all user's previous subscriptions
    this.AbonnementService.getUserAbonnementsHistory().subscribe(abonnements => {
      console.log(abonnements);
      // Extract unique sports from user's history
      const userSports = new Set(abonnements.flatMap((a: any) => 
        a.pack.club.sports.map((s: any) => s.name)
      ));
     console.log(userSports);
      // Filter clubs that have matching sports
      this.recommendedClubs = this.clubs.filter(club => 
        club.sports.some((sport: any) => userSports.has(sport.name)) &&
        !club.packs.some((pack: any) => 
          pack.abonnements?.some((a: any) => a.user?.email === this.currentUserEmail)
        )
      ).slice(0, 3); // Get top 3 recommendations
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

  public openActionModal(mode: 'subscribe' | 'renew', pack: any) {
    // Close pack modal first
    const packModal = bootstrap.Modal.getInstance(document.getElementById('PackModal'));
    if (packModal) {
      packModal.hide();
      // Remove any leftover backdrops
      const backdrops = document.getElementsByClassName('modal-backdrop');
      while (backdrops.length > 0) {
        backdrops[0].remove();
      }
    }

    // Wait for pack modal to close completely
    setTimeout(() => {
      this.modalMode = mode;
      this.modalTitle = mode === 'subscribe' ? 'Select Subscription Dates' : 'Renew Subscription';

      if (mode === 'subscribe') {
        this.selectedPackId = pack.id;
        const today = new Date();
        this.startDate = today.toISOString().split('T')[0];
        this.endDate = today.toISOString().split('T')[0];
      } else {
        const abonnement = pack.abonnements.find((a: any) => a.user?.email === this.currentUserEmail);
        if (!abonnement) return;
        this.selectedAbonnementId = abonnement.id;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.newEndDate = tomorrow.toISOString().split('T')[0];
      }

      if (this.actionModal) {
        this.actionModal.dispose();
      }
      this.actionModal = new bootstrap.Modal(document.getElementById('ActionModal'));
      this.actionModal.show();
    }, 300); // Wait for animation to complete
  }

  private closeModals() {
    // Close action modal if open
    if (this.actionModal) {
      this.actionModal.hide();
      this.actionModal = null;
    }

    // Remove any leftover backdrops
    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops.length > 0) {
      backdrops[0].remove();
    }

    // Re-enable scrolling
    document.body.classList.remove('modal-open');
  }

  handleModalAction() {
    if (this.modalMode === 'subscribe') {
      this.confirmSubscription();
    } else {
      this.confirmRenewal();
    }
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
        this.closeModals();
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

  confirmRenewal() {
    if (!this.selectedAbonnementId || !this.newEndDate) {
      console.error('Missing required data');
      return;
    }

    this.AbonnementService.renewAbonnement(this.selectedAbonnementId, this.newEndDate).subscribe({
      next: (response) => {
        console.log('Subscription renewed:', response);
        this.loadClubs();
        this.closeModals();
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

  isEligibleForRenewal(pack: any): boolean {
    const abonnement = pack.abonnements.find((a: any) => a.user?.email === this.currentUserEmail);
    if (!abonnement) return false;

    const endDate = new Date(abonnement.endDate);
    const today = new Date();
    return endDate < today;
  }
}


