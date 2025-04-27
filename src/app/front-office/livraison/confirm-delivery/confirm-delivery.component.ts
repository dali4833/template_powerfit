import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import { LivraisonService, Livraison } from 'src/app/front-office/livraison/livraisonService/livraison-service.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-confirm-delivery',
  templateUrl: './confirm-delivery.component.html',
  styleUrls: ['./confirm-delivery.component.css']
})
export class ConfirmDeliveryComponent implements OnInit {
  livraisonId!: number;
  livraison: any;
  confirmForm: FormGroup;
  accepted = false;// Reactive form

  constructor(
    private route: ActivatedRoute,
    private livraisonService: LivraisonService,
    private router: Router,
    private fb: FormBuilder // FormBuilder for reactive forms
  ) {
    this.confirmForm = this.fb.group({
      driverName: ['', Validators.required] // Field with validation
    });
  }

  ngOnInit() {
    this.livraisonId = +this.route.snapshot.params['livraisonId'];
    this.loadDeliveryDetails();
  }

  loadDeliveryDetails() {
    this.livraisonService.getLivraisonById(this.livraisonId).subscribe({
      next: (data) => this.livraison = data,
      error: (err) => console.error('Failed to load delivery', err)
    });
  }

  onSubmit() {
    if (this.confirmForm.valid) {
      const driverName = this.confirmForm.value.driverName;
      this.livraisonService.acceptDelivery(this.livraisonId, driverName).subscribe({
        next: () => {
          alert('Delivery accepted! Status updated.');
          this.router.navigate(['/']);
        },
        error: (err) => console.error('Failed to accept delivery', err)
      });
    }
  }
}
