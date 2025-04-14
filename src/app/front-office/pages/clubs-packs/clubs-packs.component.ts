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

  currentUserEmail = "user1@email.com";

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
        this.clubs = clubs.filter(club => club.status == "APPROVED").map(club => ({ 
          ...club,
        }));


        this.clubs = this.clubs.map(club => {
          console.log(club.packs)
          if(club.packs) {
            club.packs.forEach((pack: Pack) => {
              pack.abonnements = pack.abonnements.filter((abonnement: any) => abonnement.user.email === this.currentUserEmail);
              pack.abonnementsrequests = pack.abonnementsrequests.filter((abonnement: any) => abonnement.user.email === this.currentUserEmail);
              pack.abonnements = pack.abonnements.map((abonnement: any) => {
                return {
                  ...abonnement,
                  user: {
                    ...abonnement.user,
                    abonnements: undefined
                  }
                }
              });
              pack.abonnementsrequests = pack.abonnementsrequests.map((abonnement: any) => {
                return {
                  ...abonnement,
                  user: {
                    ...abonnement.user,
                    abonnementsrequests: undefined
                  }
                }
              }
              );
              return pack;
            })

            return {
              ...club,
              packs: club.packs.filter((pack: Pack) => pack.abonnements.length > 0 || pack.abonnementsrequests.length > 0)
            }
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


