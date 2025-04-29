import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { ProductStatistics } from '../models/product-statistics.model';
import { CategoryService } from '../categorie/category.service';
import { Category } from '../categorie/categorie.module';
import { CommonModule } from '@angular/common';
import {HttpHeaders} from "@angular/common/http";
import {Subscription} from "rxjs";
import {WebSocketNotificationService} from "../services/notification.service";
// Note the capital 'S'
declare var bootstrap: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  lowStockAlert: string | null = null;
  public statistics: ProductStatistics | null = null; // Initialize with null
  notifications: string[] = [];
  private notificationSubscription!: Subscription;

  categories: Category[] = [];
  product: Product = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category: {
      id: '',
      name: ''
    }
  };
  selectedFile: File | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,


    private notificationService: WebSocketNotificationService // Add this


  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.loadProductStatistics();

    // Subscribe to WebSocket notifications
    this.notificationSubscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
        // You can also trigger UI alerts here
      }
    );
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }
  clearNotification(notification: string) {
    const updatedNotifications = this.notifications.filter(n => n !== notification);
    this.notificationService.clearNotifications();
  }



  dismissAlert() {
    this.lowStockAlert = null;
  }

  loadProductStatistics(): void {
    this.productService.getProductStatistics().subscribe({
      next: (data: ProductStatistics) => {
        this.statistics = data;
        this.checkLowStock(); // You may want to check low stock again here
      },
      error: (error) => {
        console.error('Error fetching product statistics:', error);
      }
    });
  }



  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.checkLowStock();
      },
      error: (error) => console.error('Error loading products:', error)
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  openAddModal(): void {
    this.resetForm();
    const modalElement = document.getElementById('addProductModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeAddModal(): void {
    const modalElement = document.getElementById('addProductModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
    this.resetForm();
  }

  openEditModal(product: Product): void {
    this.product = { ...product };
    this.selectedFile = null;
    const modalElement = document.getElementById('editProductModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeEditModal(): void {
    const modalElement = document.getElementById('editProductModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
    this.resetForm();
  }

  editProduct(product: Product): void {
    this.openEditModal(product);
  }

  resetForm(): void {
    this.product = {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      category: {
        id: '',
        name: ''
      }
    };
    this.selectedFile = null;
  }

  updateProduct(event: Event): void {
    event.preventDefault();

    if (!this.product.id) {
      alert('Error: No product ID found');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('quantity', this.product.quantity.toString());
    formData.append('categoryId', this.product.category.id.toString()); // Ensure string

    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile);
    }

    // Debug output
    console.log('Sending update with:', {
      name: this.product.name,
      categoryId: this.product.category.id
    });

    this.productService.editProduct(this.product.id, formData).subscribe({
      next: (updatedProduct) => {
        alert(`Product updated successfully! New category: ${updatedProduct.category.name}`);
        this.loadProducts(); // Refresh the list
        this.closeEditModal();
      },
      error: (error) => {
        console.error('Update error:', error);
        alert(`Failed to update category: ${error.message || 'Unknown error'}`);
      }
    });
  }

  addProduct(event: Event): void {
    event.preventDefault();
    const formData = new FormData();

    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('quantity', this.product.quantity.toString());
    formData.append('categoryId', this.product.category.id);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.addProduct(formData).subscribe({
      next: (response) => {
        alert('Product added successfully!');
        this.loadProducts();
        this.closeAddModal();
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Failed to add product: ' + error.message);
      }
    });
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product: ' + (error.error.message || 'Unknown error'));
        }
      });
    }
  }
  checkLowStock() {
    const lowStockProducts = this.products.filter(product => product.quantity < 5); // Adjust threshold
    if (lowStockProducts.length > 0) {
      this.lowStockAlert = `Low stock alert for: ${lowStockProducts.map(p => p.name).join(', ')}`;
    } else {
      this.lowStockAlert = null; // Reset alert if no low stock products
    }
  }









}
