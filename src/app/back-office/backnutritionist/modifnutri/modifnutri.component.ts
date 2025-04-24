import { Component , OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BacknutriService } from 'src/app/back-office/services/backnutri.service';
import { Nutritionist } from 'src/app/back-office/models/Nutri';

@Component({
  selector: 'app-modifnutri',
  templateUrl: './modifnutri.component.html',
  styleUrls: ['./modifnutri.component.css']
})
export class ModifnutriComponent implements OnInit{

  nutritionist: Nutritionist = {
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nutriService: BacknutriService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.nutriService.getNutritionistById(id).subscribe(
      data => this.nutritionist = data,
      error => console.error('Erreur de chargement du nutritionniste', error)
    );
  }

  onUpdate(): void {
    this.nutriService.updateNutritionist(this.nutritionist).subscribe(
      () => {
        alert('Nutritionist updated successfully!');
        this.router.navigate(['/admin/nutritionist']);
      },
      error => {
        console.error('Erreur de mise à jour', error);
        alert('Failed to update nutritionist');
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/admin/nutritionist']);
  }

}
