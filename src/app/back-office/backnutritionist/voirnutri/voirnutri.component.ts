import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BacknutriService } from 'src/app/back-office/services/backnutri.service';
import { Nutritionist } from 'src/app/back-office/models/Nutri';

@Component({
  selector: 'app-voirnutri',
  templateUrl: './voirnutri.component.html',
  styleUrls: ['./voirnutri.component.css']
})
export class VoirnutriComponent implements OnInit{
  nutritionist: Nutritionist | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nutriService: BacknutriService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.nutriService.getNutritionistById(id).subscribe({
      next: data => {
        this.nutritionist = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading nutritionist', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/nutritionist']);
  }

}
