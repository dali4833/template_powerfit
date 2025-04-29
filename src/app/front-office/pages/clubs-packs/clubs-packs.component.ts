import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbonnementService } from 'src/app/back-office/abonnement-managment/services/Abonnement.service';
import { AbonnementrequestsService } from 'src/app/back-office/abonnementrequests-mangment/services/Abonnementrequests.service';
import { ClubService } from 'src/app/back-office/clubs-managment/services/club.service';
import { PackService } from 'src/app/back-office/packs-managment/services/pack.service';
import {TrophyService} from "../../../back-office/trophiesManagement/services/Trophy.service";


declare var bootstrap: any;

interface Pack {
  price: number;
  id: number;
  name: string;
  duration: number;  // Durée du pack (en jours par exemple)
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
  selectedPackDuration: number | null = null;  // Durée du pack
  selectedAbonnementPackDuration : number | null = null ;
  modalMode: 'subscribe' | 'renew' = 'subscribe';
  modalTitle: string = '';
  private actionModal: any;

  recommendedClubs: any[] = [];
  private pointsRequiredForTrophy: any;

  constructor(
    private ClubService: ClubService,
    private AbonnementRequest: AbonnementrequestsService,
    private AbonnementService: AbonnementService,
    private trophyService: TrophyService,
  ) { }

  ngOnInit(): void {
    this.loadClubs();
    this.loadRecommendations();
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
   // this.toastr.info('Ceci est une notification d\'information.', 'Information');
    this.loading = true;
    this.ClubService.getClubs().subscribe({
      next: (clubs) => {
        this.clubs = clubs
          .filter(club => club.status === "APPROVED")
          .map(club => {
            const mappedClub = { ...club };

            // Ajouter l'image (si elle existe)
            mappedClub.imageUrl = `http://localhost:8089/clubs/${club.id}/image`;
            console.log("imageUrl for club:", mappedClub.imageUrl);

            // Charger le taux de renouvellement et les données de performance
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
              }).sort((a: Pack, b: Pack) => (b.subscriptionCount || 0) - (a.subscriptionCount || 0)); // Tri par le nombre d'abonnements
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
    this.ClubService.getrecommandations().subscribe({
      next: (clubs) => {
        this.recommendedClubs = clubs.filter((club: any) => club.status === "APPROVED");
      },
      error: (error) => {
        console.error(error);
      }
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
    const packModal = bootstrap.Modal.getInstance(document.getElementById('PackModal'));
    if (packModal) {
      packModal.hide();
      const backdrops = document.getElementsByClassName('modal-backdrop');
      while (backdrops.length > 0) {
        backdrops[0].remove();
      }
    }

    setTimeout(() => {
      this.modalMode = mode;
      this.modalTitle = mode === 'subscribe' ? 'Select Subscription Dates' : 'Renew Subscription';

      if (mode === 'subscribe') {
        this.selectedPackId = pack.id;
        this.selectedPackDuration = pack.duration;  // Récupérer la durée du pack
        const today = new Date();
        this.startDate = today.toISOString().split('T')[0];
        this.endDate = today.toISOString().split('T')[0];
      } else {
        const abonnement = pack.abonnements.find((a: any) => a.user?.email === this.currentUserEmail);
        if (!abonnement) return;
        this.selectedAbonnementId = abonnement.id;
        this.selectedAbonnementPackDuration = pack.duration; // Assigner la durée du pack au renouvellement
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.newEndDate = tomorrow.toISOString().split('T')[0];
      }

      if (this.actionModal) {
        this.actionModal.dispose();
      }
      this.actionModal = new bootstrap.Modal(document.getElementById('ActionModal'));
      this.actionModal.show();
    }, 300);
  }


  private closeModals() {
    if (this.actionModal) {
      this.actionModal.hide();
      this.actionModal = null;
    }

    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops.length > 0) {
      backdrops[0].remove();
    }

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
    if (!this.selectedPackId || this.selectedPackDuration == null) {
      console.error('Missing required data');
      return;
    }

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + this.selectedPackDuration);
    const endDateString = endDate.toISOString().split('T')[0];

    const abonnementrequest: any = {
      startDate: startDate,
      endDate: endDateString,
      duration: this.selectedPackDuration
    };

    this.AbonnementRequest.createRequest(abonnementrequest, this.selectedPackId).subscribe({
      next: (response) => {
        console.log('Subscription request created:', response);
        this.loadClubs();
        this.closeModals();
        this.selectedPackId = null;
        this.selectedPackDuration = null;
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
    if (!this.selectedAbonnementId || this.selectedAbonnementPackDuration == null) {
      console.error('Missing required data');
      return;
    }

// Calculer la nouvelle date de fin en fonction de la durée du pack
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + this.selectedAbonnementPackDuration);  // Ajouter la durée du pack

// Formater la nouvelle date au format YYYY-MM-DD
    this.newEndDate = newEndDate.toISOString().split('T')[0];  // Assurez-vous que c'est une chaîne


    const abonnementData = {
      id: this.selectedAbonnementId, // L'ID de l'abonnement à renouveler
      endDate: newEndDate.toISOString().split('T')[0] // Date formatée en YYYY-MM-DD
    };

    this.AbonnementService.renewAbonnement(this.selectedAbonnementId, this.selectedAbonnementPackDuration).subscribe({
      next: (response) => {
        console.log('Abonnement renouvelé:', response);
        this.assignTrophy();

        this.loadClubs();
        this.closeModals();
      },
      error: (error) => {
        console.error('Erreur lors du renouvellement de l\'abonnement:', error);
        if (error.status === 400) {
            alert('❌ Erreur: La nouvelle date de fin est invalide.');
        } else if (error.status === 403) {
            alert('⚠️ Vous n\'avez pas le droit de renouveler cet abonnement.');
        } else {
            alert('❌ Une erreur inattendue s\'est produite.');
        }
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

  // assignTrophy() {
  //   this.trophyService.assignTrophyToUser().subscribe({
  //     next: (response) => {
  //       console.log('Trophée attribué:', response);
  //       this.toastr.success('Félicitations! Un trophée a été attribué pour le renouvellement de votre abonnement.', 'Succès');
  //     },
  //     error: (error) => {
  //       console.error('Erreur lors de l\'attribution du trophée:', error);
  //       this.toastr.error('Une erreur est survenue lors de l\'attribution du trophée.', 'Erreur');
  //     }
  //   });
  // }

  assignTrophy() {
    this.trophyService.assignTrophyToUser().subscribe({
      next: (response) => {
        console.log('Trophy assigned:', response);
        alert('Congratulations! A trophy has been awarded for your subscription renewal.');
      },
      error: (error) => {
        console.error('Error while assigning the trophy:', error);
        alert('❌ An error occurred while assigning the trophy.');
      }
    });
  }


}
