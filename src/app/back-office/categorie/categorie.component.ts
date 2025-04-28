import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from './categorie.module';
import { CategoryService } from './category.service';
import {SearchService} from "./search.service";

declare var bootstrap: any; // For Bootstrap modal functionality

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css']
})
export class CategorieComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];

  searchTerm: string = '';
  category: Category = {
    name: '',
    description: ''

  };
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private categoryService: CategoryService , private searchService: SearchService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.searchService.currentSearchTerm.subscribe(term => {
      this.filterCategories(term);
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = data; // Initialize with all categories
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  filterCategories(term: string): void {
    if (term) {
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(term.toLowerCase()) ||
        category.description.toLowerCase().includes(term.toLowerCase())
      );
    } else {
      this.filteredCategories = this.categories; // Reset to all categories if search term is empty
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  openAddModal(): void {
    this.category = { name: '', description: '' };
    this.selectedFile = null;
    const modalElement = document.getElementById('addCategoryModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeAddModal(): void {
    const modalElement = document.getElementById('addCategoryModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
    this.resetForm();
  }

  openEditModal(category: Category): void {
    this.category = { ...category };
    this.selectedFile = null;
    const modalElement = document.getElementById('editCategoryModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeEditModal(): void {
    const modalElement = document.getElementById('editCategoryModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
    this.resetForm();
  }

  editCategory(category: Category): void {
    this.openEditModal(category);
  }

  resetForm(): void {
    this.category = { name: '', description: ''};
    this.selectedFile = null;
  }

  updateCategory(event: Event): void {
    event.preventDefault();
    if (!this.category.id) return;

    const formData = new FormData();
    formData.append('name', this.category.name);
    formData.append('description', this.category.description);

    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile, this.selectedFile.name);
    }

    this.categoryService.editCategory(this.category.id, formData).subscribe({
      next: (response) => {
        alert('Category updated successfully!');
        this.loadCategories();
        this.closeEditModal();
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Failed to update category: ' + error.message);
      }
    });
  }

  addCategory(event: Event): void {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', this.category.name);
    formData.append('description', this.category.description);

    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile, this.selectedFile.name);
    }

    this.categoryService.addCategory(formData).subscribe({
      next: (response) => {
        alert('Category added successfully!');
        this.loadCategories();
        this.closeAddModal();
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Failed to add category: ' + error.message);
      }
    });
  }

  deleteCategory(categoryId: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: () => {
          alert('Category deleted successfully!');
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Failed to delete category: ' + (error.error.message || 'Unknown error'));
        }
      });
    }
  }
}
