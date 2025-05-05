import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreComponent } from "./front-office/store/store.component";
import { ProductsComponent } from "./front-office/store/products/products.component";
import { ProductDetailComponent } from "./front-office/store/product-detail/product-detail.component";
import { LoginComponent } from './front-office/auth/login/login.component';

import { RecipeComponent } from './front-office/nutrition/recipe/recipe.component';
import { MealPlanComponent } from './front-office/nutrition/meal-plan/meal-plan.component';
import { DietProgramComponent } from './front-office/nutrition/diet-program/diet-program.component';
import { NutritionComponent } from './front-office/nutrition/nutrition.component';


import { NutritionistAIComponent } from './front-office/nutrition/nutritionist-ai/nutritionist-ai.component';
import { FavoriterecipesComponent } from './front-office/nutrition/favoriterecipes/favoriterecipes.component';

import { ChatComponent } from './front-office/pages/chat/chat.component';
import { ResetPasswordComponent } from './front-office/auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './front-office/auth/forgot-password/forgot-password.component';
import { RegisterOwnerComponent } from './front-office/auth/register-owner/register-owner.component';
import { AuthComponent } from './back-office/auth/auth.component';
import { UsersComponent } from './back-office/users/users.component';
import { RegisterComponent } from './front-office/auth/register/register.component';
import { UserprofileComponent } from './front-office/userprofile/userprofile.component';
import { AllTemplateFrontComponentComponent } from './front-office/all-template-front-component/all-template-front-component.component';
import { AllTemplateBackComponentComponent } from './back-office/all-template-back-component/all-template-back-component.component';
import { TrainingSessionComponent } from './front-office/pages/training-session/training-session.component';
import { ClubsPacksComponent } from './front-office/pages/clubs-packs/clubs-packs.component';
import { TrophiesComponent } from './front-office/pages/trophies/trophies.component';
import { ClubPerformanceComponent } from './back-office/clubs-managment/club-performance/club-performance.component'; // Assure-toi que le chemin est correct
import { RegisterNutrusionistComponent } from './front-office/auth/register-nutrusionist/register-nutrusionist.component';
import { AuthGuard } from './guards/auth.guard';
import {CategoriesComponent} from "./front-office/categories/categories.component";
import { LivraisonComponent } from './front-office/livraison/livraison.component';
import { PromotionFrontComponent } from './front-office/promotion-front/promotion-front.component';
import {ConfirmDeliveryComponent} from "./front-office/livraison/confirm-delivery/confirm-delivery.component";
import { NutritionistComponent } from "./front-office/nutritionist/nutritionist.component";
import { MedicalfolderComponent } from "./front-office/nutritionist/medicalfolder/medicalfolder.component";
import { MeetingComponent } from "./front-office/nutritionist/meeting/meeting.component";
import { NewMeetingComponent } from './front-office/nutritionist/meeting/new-meeting/new-meeting.component';
import { UpdatemeetingComponent } from './front-office/nutritionist/meeting/updatemeeting/updatemeeting.component';
import { ShowmeetingComponent } from './front-office/nutritionist/meeting/showmeeting/showmeeting.component';
import { ShowmedicalfolderComponent } from './front-office/nutritionist/medicalfolder/showmedicalfolder/showmedicalfolder.component';
import { NewmedicalfolderComponent } from './front-office/nutritionist/medicalfolder/newmedicalfolder/newmedicalfolder.component';
import { SlotSelectorComponent } from './front-office/nutritionist/meeting/slot-selector/slot-selector.component';
import { UpdatemedicalfolderComponent } from './front-office/nutritionist/medicalfolder/updatemedicalfolder/updatemedicalfolder.component';
import { BacknutritionistComponent } from './back-office/backnutritionist/backnutritionist.component';
import {SuccessComponent} from "./front-office/success/success.component";
import {ProductComponent} from "./back-office/product/product.component";
import {CategorieComponent} from "./back-office/categorie/categorie.component";
import {PromotionComponent} from "./back-office/promotion/promotion.component";
import {
  ExerciceRecommendationComponent
} from "./front-office/exercice-recommendation/exercice-recommendation/exercice-recommendation.component";






// {
//   path: '', component: AllTemplateFrontComponentComponent, children: [ // Home route









//     {
//       path: '',
//       loadChildren: () => import('./front-office/pages/clubcreation-form/clubreq.module').then(m => m.clubreqModule)
//     },

//     { path: 'performance/:clubId', component: ClubPerformanceComponent }





//   ]
// },


const routes: Routes = [
  { path: 'admin/auth', component: AuthComponent },
  {
    path: 'admin',
    component: AllTemplateBackComponentComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
      { path: 'sports-management', loadChildren: () => import('./back-office/sports-managment/sports.module').then(m => m.SportsModule) },
      { path: 'packs-management', loadChildren: () => import('./back-office/packs-managment/packs.module').then(m => m.PacksModule) },
      { path: 'clubs-management', loadChildren: () => import('./back-office/clubs-managment/club.module').then(m => m.ClubModule) },
      { path: 'clubrequests-management', loadChildren: () => import('./back-office/clubrequests-managment/clubreq.module').then(m => m.clubreqModule) },
      { path: 'abonnementrequests-management', loadChildren: () => import('./back-office/abonnementrequests-mangment/abonnReq.module').then(m => m.AbonnReqModule) },
      { path: 'abonnement-management', loadChildren: () => import('./back-office/abonnement-managment/Abonn.module').then(m => m.AbonnModule) },
      { path: 'TrainingSession-management', loadChildren: () => import('./back-office/TrainingSessionMangment/TrainingSession.module').then(m => m.TrainingSessionModule) },
      { path: 'Review-management', loadChildren: () => import('./back-office/ReviewManagment/Review.module').then(m => m.ReviewModule) },
      { path: 'Booking-management', loadChildren: () => import('./back-office/BookingManagment/booking.module').then(m => m.BookingModule) },
      { path: 'categories', component: CategorieComponent ,canActivate: [AuthGuard]},
      { path: 'products', component: ProductComponent,canActivate: [AuthGuard]  },
      { path: 'success', component: SuccessComponent,canActivate: [AuthGuard]  },
      { path: 'Booking-management', loadChildren: () => import('./back-office/BookingManagment/booking.module').then(m => m.BookingModule) },
      { path: 'Trophy-management', loadChildren: () => import('./back-office/trophiesManagement/Trophy.module').then(m => m.TrophyModule) },
      { path:'nutritionist',component: BacknutritionistComponent},
      { path: 'promotions',component: PromotionComponent}
    ]
  },
  {
    path: '',
    component: AllTemplateFrontComponentComponent,
    children: [
      {
        path: 'nutrition',
        component: NutritionComponent,
        children: [
          { path: '', redirectTo: 'nutritionistAI', pathMatch: 'full' },

          { path: 'meal-plan', component: MealPlanComponent},
          { path: 'diet-program', component: DietProgramComponent },
          { path: 'recipe', component: RecipeComponent } ,
          {path:'nutritionistAI',component:NutritionistAIComponent},
          {path:'favorite', component:FavoriterecipesComponent}
        ]
      },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'register-club', component: RegisterOwnerComponent },
      { path: 'register-nutrisonist', component: RegisterNutrusionistComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'trainingSession', component: TrainingSessionComponent },
      { path: 'chat', component: ChatComponent },

      { path: 'Clubs', component: ClubsPacksComponent },

      { path: 'Trophies', component: TrophiesComponent },


      {
        path: 'userprofile',
        component: UserprofileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'store',
        component: StoreComponent,
        canActivate: [AuthGuard],
        children: [
          { path: 'products', component: ProductsComponent },
          { path: 'products/:id', component: ProductDetailComponent },
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
      {path: "recommend-exercice", component: ExerciceRecommendationComponent},
      { path: 'chat', component: ChatComponent },
      { path: 'livraison', component: LivraisonComponent },
      { path: 'promotionsfront', component: PromotionFrontComponent },
      {path: 'delivery-confirm/:livraisonId',
        component: ConfirmDeliveryComponent},
      {
        path: 'nutritionist', component: NutritionistComponent,
        children: [
          { path: 'medicalfolder', component: MedicalfolderComponent,
            children : [
              {path: 'showMedicalfolder/:id', component:ShowmedicalfolderComponent},
              {path: 'addMedical', component:NewmedicalfolderComponent},
              { path: 'update/:id', component: UpdatemedicalfolderComponent }

            ]
          }, // /nutritionist/medicalfolder
          { path: 'meeting', component: MeetingComponent,
            children:[
              {path: 'addMeeting', component:NewMeetingComponent},
              {path: 'showMeeting/:id', component:ShowmeetingComponent},
              { path: 'updateMeeting/:id', component: UpdatemeetingComponent },
              { path: 'slot', component: SlotSelectorComponent }

            ]
          }, // /nutritionist/meeting
          //{ path: 'new', component: MeetingAddComponent }  //form component
        ]
      }
    ]
  },

  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
