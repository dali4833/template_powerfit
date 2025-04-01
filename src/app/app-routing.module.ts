import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from "./store/store.component";
import { ProductsComponent } from "./store/products/products.component";
import { ProductDetailComponent } from "./store/product-detail/product-detail.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  { path: '', component: HomeComponent }, // Home route
  {
    path: 'store',
    component: StoreComponent,
    children: [
      { path: '', component: StoreComponent }, // Display StoreComponent when /store
      { path: 'products', component: ProductsComponent }, // Products listing
      { path: 'products/:id', component: ProductDetailComponent } // Product details
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
