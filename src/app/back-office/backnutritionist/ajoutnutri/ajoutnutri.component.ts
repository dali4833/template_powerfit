import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BacknutriService } from '../../services/backnutri.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajoutnutri',
  templateUrl: './ajoutnutri.component.html',
  styleUrls: ['./ajoutnutri.component.css']
})
export class AjoutnutriComponent implements OnInit {
  nutritionistForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private nutriService: BacknutriService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nutritionistForm = this.fb.group({
      user_type: ['NUTRITIONIST', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roles: ['NUTRITIONIST', Validators.required],
      enabled: [true],
      phone: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      hiredDate: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.nutritionistForm.invalid) {
      console.log('Form is invalid:', this.nutritionistForm);
      return;
    }

    console.log('Form data:', this.nutritionistForm.value);

    this.nutriService.addNutritionist(this.nutritionistForm.value)
      .subscribe(() => {
        this.router.navigate(['/admin/nutritionist']);
      }, err => {
        console.error('Error:', err);
      });
  }
  cancel(): void {
    this.router.navigate(['/admin/nutritionist']);
  }
}
