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
import { RecipeComponent } from './front-office/nutrition/recipe/recipe.component';
import { MealPlanComponent } from './front-office/nutrition/meal-plan/meal-plan.component';
import { DietProgramComponent } from './front-office/nutrition/diet-program/diet-program.component';
import { NutritionComponent } from './front-office/nutrition/nutrition.component';

const routes: Routes = [


  { path: 'admin/auth', component: AuthComponent }, // Display StoreComponent when /store

  { path: 'dashboard', component: AllTemplateBackComponentComponent, children: [ 


      {path: 'users', component: UsersComponent}, // Users listing
]},










// redirect to home if no path is wrong 


  { path: '', component: AllTemplateFrontComponentComponent, children: [ // Home route
  { path: 'login', component: LoginComponent },
  { path: 'userprofile', component: UserprofileComponent },

  { path: 'register', component: RegisterComponent },
  { path: 'register-club', component: RegisterOwnerComponent },

  { path: 'reset-password', component: ResetPasswordComponent },
  {path: 'forgot-password', component: ForgotPasswordComponent},

  {
    path: 'store',
    component: StoreComponent,
    children: [
      { path: '', component: StoreComponent }, // Display StoreComponent when /store
      { path: 'products', component: ProductsComponent }, // Products listing
      { path: 'products/:id', component: ProductDetailComponent } // Product details

    ]
  },
  {
    path: 'nutrition',
    component: NutritionComponent,
    children: [
      { path: '', redirectTo: 'meal-plan', pathMatch: 'full' },

      { path: 'meal-plan', component: MealPlanComponent},
      { path: 'diet-program', component: DietProgramComponent },
      { path: 'recipe', component: RecipeComponent } 
    ]
  }
]
},
{ path: '**', redirectTo: '/' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
