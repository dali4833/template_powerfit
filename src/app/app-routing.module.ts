import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from "./front-office/store/store.component";
import { ProductsComponent } from "./front-office/store/products/products.component";
import { ProductDetailComponent } from "./front-office/store/product-detail/product-detail.component";
import { LoginComponent } from './front-office/auth/login/login.component';
import { RegisterComponent } from './front-office/auth/register/register.component';
import { ForgotPasswordComponent } from './front-office/auth/forgot-password/forgot-password.component';
import { UserprofileComponent } from './front-office/userprofile/userprofile.component';
import { AllTemplateFrontComponentComponent } from './front-office/all-template-front-component/all-template-front-component.component';
import { AllTemplateBackComponentComponent } from './back-office/all-template-back-component/all-template-back-component.component';
import { TrainingSessionComponent } from './front-office/pages/training-session/training-session.component';
import {AuthComponent} from "./back-office/auth/auth.component";
import {UsersComponent} from "./back-office/users/users.component";
import { ChatComponent } from './front-office/pages/chat/chat.component';
import {CategoriesComponent} from "./front-office/categories/categories.component";
import {CategorieComponent} from "./back-office/categorie/categorie.component";
import {ProductComponent} from "./back-office/product/product.component";
import {SuccessComponent} from "./front-office/success/success.component";
import {PromotionComponent} from "./back-office/promotion/promotion.component";
import { LivraisonComponent } from './front-office/livraison/livraison.component';
import { PromotionFrontComponent } from './front-office/promotion-front/promotion-front.component';
import {ConfirmDeliveryComponent} from "./front-office/livraison/confirm-delivery/confirm-delivery.component";

const routes: Routes = [
  {
    path: 'admin',
    component: AllTemplateBackComponentComponent,
    children: [
     // Authentication
      { path: 'auth', component: AuthComponent },
      { path: 'categories', component: CategorieComponent },
      { path: 'products', component: ProductComponent },
      { path: 'success', component: SuccessComponent },





      // Dashboard
      {
        path: 'dashboard',
        children: [
          { path: 'users', component: UsersComponent }  // Users listing
        ]

      },

      // Management Modules
      { path: 'sports-management', loadChildren: () => import('./back-office/sports-managment/sports.module').then(m => m.SportsModule) },
      { path: 'packs-management', loadChildren: () => import('./back-office/packs-managment/packs.module').then(m => m.PacksModule) },
      { path: 'clubs-management', loadChildren: () => import('./back-office/clubs-managment/club.module').then(m => m.ClubModule) },
      { path: 'clubrequests-management', loadChildren: () => import('./back-office/clubrequests-managment/clubreq.module').then(m => m.clubreqModule) },
      { path: 'abonnementrequests-management', loadChildren: () => import('./back-office/abonnementrequests-mangment/abonnReq.module').then(m => m.AbonnReqModule) },
      { path: 'abonnement-management', loadChildren: () => import('./back-office/abonnement-managment/Abonn.module').then(m => m.AbonnModule) },
      { path: 'TrainingSession-management', loadChildren: () => import('./back-office/TrainingSessionMangment/TrainingSession.module').then(m => m.TrainingSessionModule) },
      { path: 'Review-management', loadChildren: () => import('./back-office/ReviewManagment/Review.module').then(m => m.ReviewModule) },
      { path: 'Booking-management', loadChildren: () => import('./back-office/BookingManagment/booking.module').then(m => m.BookingModule) },
      { path: 'promotions' , component: PromotionComponent }
    ]
  },
  {
    path: '',
    component: AllTemplateFrontComponentComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'userprofile', component: UserprofileComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      {
        path: 'store',
        component: StoreComponent,
        children: [
          {
            path: '',
            component: CategoriesComponent // Show categories by default
          },
          {
            path: 'categories/:categoryId',
            component: ProductsComponent
          },
          {
            path: 'products/:productId',
            component: ProductDetailComponent
          } // Product details
        ]
      },
      { path: 'trainingSession', component: TrainingSessionComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'livraison', component: LivraisonComponent },
      { path: 'promotionsfront', component: PromotionFrontComponent },
      {path: 'delivery-confirm/:livraisonId',
        component: ConfirmDeliveryComponent}
    ]
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
