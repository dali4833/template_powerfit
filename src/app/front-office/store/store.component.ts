import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent {
  selectedCategory: string | null = null;

  constructor(private router: Router) {}

  onCategorySelected(categoryId: string) {
    this.selectedCategory = categoryId;
    this.router.navigate(['/store/categories', categoryId]); // Navigate to products page
  }
}
