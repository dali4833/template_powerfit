import { Component, OnInit } from '@angular/core';
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
export class ClubsPacksComponent implements OnInit {

  clubs: any[] = [];
  loading = false;
  selectedClub: any | null = null;

  currentUserEmail = "test@hotmail.fr";

  constructor(
    private ClubService: ClubService,
    private AbonnementRequest : AbonnementrequestsService
  ) { }

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.loading = true;
    this.ClubService.getClubs().subscribe({
      next: (clubs) => {
        this.clubs = clubs
          .filter(club => club.status === "APPROVED")
          .map(club => {
            if (club.packs) {
              // Marquer les packs liés à l'utilisateur sans les filtrer
              club.packs.forEach((pack: Pack) => {
                const abonnements = pack.abonnements || [];
                const demandes = pack.abonnementsrequests || [];

                pack.userIsSubscribed = abonnements.some((a: any) => a.user?.email === this.currentUserEmail);
                pack.userHasRequested = demandes.some((r: any) => r.user?.email === this.currentUserEmail);
              });

              // Retourner le club avec tous ses packs
              return { ...club, packs: club.packs };
            }

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






  subscribeToPack(packid : number){

    this.AbonnementRequest.createRequest(packid).subscribe({
      next: (response) => {
        console.log(response);
        this.loadClubs();
      }, error : (error) => {
        console.error(error);
      }
    });


  }
}


