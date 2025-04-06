import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from "./store/store.component";
import { ProductsComponent } from "./store/products/products.component";
import { ProductDetailComponent } from "./store/product-detail/product-detail.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { UserprofileComponent } from './user/userprofile/userprofile.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Home route
  { path: 'login', component: LoginComponent },
  { path: 'userprofile', component: UserprofileComponent },

  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
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
