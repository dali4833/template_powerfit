import { Component, OnInit } from '@angular/core';
import { BacknutriService } from 'src/app/back-office/services/backnutri.service';
import { Nutritionist } from 'src/app/back-office/models/Nutri';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-backnutritionist',
  templateUrl: './backnutritionist.component.html',
  styleUrls: ['./backnutritionist.component.css']
})
export class BacknutritionistComponent implements OnInit {

  nutritionists: Nutritionist[] = [];
  selectedNutritionist: Nutritionist = this.initNutritionist();
  isInChildRoute = false;

  constructor(
    private nutritionistService: BacknutriService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getNutritionists();
    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.isInChildRoute =
        url.includes('/admin/nutritionist/ajout') ||
        url.includes('/admin/nutritionist/modif') ||
        url.includes('/admin/nutritionist/voir');
    });
  }
  
  

  private initNutritionist(): Nutritionist {
    return {
      id: 0,
      name: '',
      email: '',
      phone: '',
      salary: 0,
      hiredDate: new Date(),
      user_type: 'NUTRITIONIST',
      roles: 'NUTRITIONIST',
      enabled: true
    };
  }

  getNutritionists(): void {
    this.nutritionistService.getAllNutritionists().subscribe(
      (data: Nutritionist[]) => this.nutritionists = data,
      (error) => console.error('Erreur lors de la récupération', error)
    );
  }

  addNutritionist(): void {
    this.nutritionistService.addNutritionist(this.selectedNutritionist).subscribe(
      (newNutri: Nutritionist) => {
        this.nutritionists.push(newNutri);
        this.selectedNutritionist = this.initNutritionist();
      },
      (error) => console.error('Erreur d\'ajout', error)
    );
  }

  updateNutritionist(): void {
    this.nutritionistService.updateNutritionist(this.selectedNutritionist).subscribe(
      (updatedNutri: Nutritionist) => {
        const index = this.nutritionists.findIndex(n => n.id === updatedNutri.id);
        if (index !== -1) {
          this.nutritionists[index] = updatedNutri;
        }
        this.selectedNutritionist = this.initNutritionist();
      },
      (error) => console.error('Erreur de mise à jour', error)
    );
  }

  deleteNutritionist(id: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete this nutritionist?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.nutritionistService.deleteNutritionist(id).subscribe(
          () => {
            this.nutritionists = this.nutritionists.filter(n => n.id !== id);
            Swal.fire('Deleted!', 'The nutritionist has been deleted.', 'success');
          },
          (error) => {
            console.error('Deletion error', error);
            Swal.fire('Error', 'An error occurred while deleting.', 'error');
          }
        );
      }
    });
  }
  

  editNutritionist(nutri: Nutritionist): void {
    this.selectedNutritionist = { ...nutri };
  }

  cancelEdit(): void {
    this.selectedNutritionist = this.initNutritionist();
  }

  goToAdd(): void {
    this.router.navigate(['admin/nutritionist/ajout']);
  }
  goToUpdate(id: number): void {
    this.router.navigate(['admin/nutritionist/modif', id]);
  }
  goToView(id: number): void {
    this.router.navigate(['admin/nutritionist/voir', id]);
  }
  
}
