// categories.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        // Remove duplicates and filter out undefined values
        const uniqueIds = Array.from(new Set(data.map(a => a.id)));
        this.categories = uniqueIds
          .map(id => data.find(a => a.id === id))
          .filter((category): category is Category => category !== undefined); // Type guard to filter out undefined
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  navigateToProducts(categoryId: number): void {
    this.router.navigate(['/store/categories', categoryId]);
  }
}
