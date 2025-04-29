import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromotionService, Promotion } from 'src/app/back-office/promotion/promotionService/promotion-service.service';

@Component({
  selector: 'app-promotion-front',
  templateUrl: './promotion-front.component.html',
  styleUrls: ['./promotion-front.component.css']
})

export class PromotionFrontComponent implements OnInit {
  promotions: Promotion[] = [];
  currentIndex = 0;

  nextPromotion(): void {
    if (this.promotions.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.promotions.length;
    }
  }

  prevPromotion(): void {
    if (this.promotions.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.promotions.length) % this.promotions.length;
    }
  }
  promotionForm: FormGroup;
  isEdit = false;


  constructor(private fb: FormBuilder, private promotionService: PromotionService) {
    this.promotionForm = this.fb.group({
      id: [null],
      category: ['', Validators.required],
      description: ['', Validators.required],
      discountPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      expiryDate: ['', Validators.required]
    });
  }



  ngOnInit(): void {
    this.loadPromotions();
    setInterval(() => this.nextPromotion(), 5000);
  }

  loadPromotions(): void {
    this.promotionService.getPromotions().subscribe((data) => {
      this.promotions = data;
    });
  }

  onSubmit(): void {
    const promotion: Promotion = this.promotionForm.value;

    if (this.isEdit) {
      this.promotionService.updatePromotion(promotion.id, promotion).subscribe(() => {
        this.loadPromotions();
        this.resetForm();
      });
    } else {
      this.promotionService.createPromotion(promotion).subscribe(() => {
        this.loadPromotions();
        this.resetForm();
      });
    }
  }

  editPromotion(promotion: Promotion): void {
    this.isEdit = true;
    this.promotionForm.patchValue(promotion);
  }

  deletePromotion(id: number): void {
    this.promotionService.deletePromotion(id).subscribe(() => {
      this.loadPromotions();
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.promotionForm.reset({
      id: null,
      category: '',
      description: '',
      discountPercentage: 0,
      startDate: '',
      endDate: '',
      expiryDate: ''
    });
  }
}
