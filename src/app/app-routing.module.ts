import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from "./front-office/store/store.component";
import { ProductsComponent } from "./front-office/store/products/products.component";
import { ProductDetailComponent } from "./front-office/store/product-detail/product-detail.component";
import { HomeComponent } from "./front-office/home/home.component";
import { LoginComponent } from './front-office/auth/login/login.component';
import { RegisterComponent } from './front-office/auth/register/register.component';
import { UserprofileComponent } from './front-office/userprofile/userprofile.component';
import { AllTemplateFrontComponentComponent } from './front-office/all-template-front-component/all-template-front-component.component';
import { AllTemplateBackComponentComponent } from './back-office/all-template-back-component/all-template-back-component.component';
import { ResetPasswordComponent } from './front-office/auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './front-office/auth/forgot-password/forgot-password.component';
import { RegisterOwnerComponent } from './front-office/auth/register-owner/register-owner.component';
import { AuthComponent } from './back-office/auth/auth.component';
import { UsersComponent } from './back-office/users/users.component';
import { RegisterNutrusionistComponent } from './front-office/auth/register-nutrusionist/register-nutrusionist.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: 'admin/auth', component: AuthComponent },
  { 
    path: 'dashboard', 
    component: AllTemplateBackComponentComponent,
    canActivate: [AuthGuard], // 🔒 Protect Dashboard
    children: [ 
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] }, // 🔒 Protect Users
    ]
  },
  { 
    path: '', 
    component: AllTemplateFrontComponentComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'register-club', component: RegisterOwnerComponent },
      { path: 'register-nutrisonist', component: RegisterNutrusionistComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },

      { 
        path: 'userprofile', 
        component: UserprofileComponent, 
        canActivate: [AuthGuard] // 🔒 Protect Profile
      },

      {
        path: 'store',
        component: StoreComponent,
        canActivate: [AuthGuard], // 🔒 Protect Store
        children: [
          { path: '', component: StoreComponent },
          { path: 'products', component: ProductsComponent },
          { path: 'products/:id', component: ProductDetailComponent }
        ]
      },
    ]
  },
  { path: '**', redirectTo: '/' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
