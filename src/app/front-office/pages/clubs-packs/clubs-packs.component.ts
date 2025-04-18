import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(
    private ClubService: ClubService,
    private AbonnementRequest : AbonnementrequestsService
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
  }

  loadClubs(): void {
    this.loading = true;
    this.ClubService.getClubs().subscribe({
      next: (clubs) => {
        this.clubs = clubs
          .filter(club => club.status === "APPROVED")
          .map(club => {
            const mappedClub = { ...club };
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
      },
      error: (error) => {
        console.error('Error creating subscription request:', error);
      }
    });
  }
}


