
import { NutritionComponent } from './front-office/nutrition/nutrition.component';
import { RecipeComponent } from './front-office/nutrition/recipe/recipe.component';
import { MealPlanComponent } from './front-office/nutrition/meal-plan/meal-plan.component';
import { DietProgramComponent } from './front-office/nutrition/diet-program/diet-program.component';



import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './front-office/header/header.component';
import { FooterComponent } from './front-office/footer/footer.component';
import { HomeComponent } from './front-office/home/home.component';
import { StoreComponent } from './front-office/store/store.component';
import { ProductsComponent } from './front-office/store/products/products.component';
import { ProductDetailComponent } from './front-office/store/product-detail/product-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './front-office/auth/login/login.component';
import { RegisterComponent } from './front-office/auth/register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserprofileComponent } from './front-office/userprofile/userprofile.component';
import { AllTemplateFrontComponentComponent } from './front-office/all-template-front-component/all-template-front-component.component';
import { AllTemplateBackComponentComponent } from './back-office/all-template-back-component/all-template-back-component.component';
import { NavbarComponent } from './back-office/navbar/navbar.component';
import { SidebarComponent } from './back-office/sidebar/sidebar.component';
import { FooterBackComponent } from './back-office/footer-back/footer-back.component';
import { TrainingSessionComponent } from './front-office/pages/training-session/training-session.component';
import { ClubsPacksComponent } from './front-office/pages/clubs-packs/clubs-packs.component';
import { ResetPasswordComponent } from './front-office/auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './front-office/auth/forgot-password/forgot-password.component';
import { RegisterOwnerComponent } from './front-office/auth/register-owner/register-owner.component';
import { AuthComponent } from './back-office/auth/auth.component';
import { UsersComponent } from './back-office/users/users.component';
import { TrophiesComponent } from './front-office/pages/trophies/trophies.component';
import { clubreqModule } from './back-office/clubrequests-managment/clubreq.module';
import { ClubPerformanceComponent } from './back-office/clubs-managment/club-performance/club-performance.component';
import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";
import {provideToastr, ToastrModule} from 'ngx-toastr';

import { FullCalendarModule } from '@fullcalendar/angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ChatComponent } from './front-office/pages/chat/chat.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { NutritionistAIComponent } from './front-office/nutrition/nutritionist-ai/nutritionist-ai.component';
import { FavoriterecipesComponent } from './front-office/nutrition/favoriterecipes/favoriterecipes.component';

import { CategoriesComponent } from './front-office/categories/categories.component';
import { NotificationComponent } from './front-office/notification/notification.component';
import { CartCounterComponent } from './front-office/cart-counter/cart-counter.component';
import { CategorieComponent } from './back-office/categorie/categorie.component';
import { ProductComponent } from './back-office/product/product.component';
import { SuccessComponent } from './front-office/success/success.component';
import { PromotionComponent } from './back-office/promotion/promotion.component';
import { LivraisonComponent } from './front-office/livraison/livraison.component';
import { PromotionFrontComponent } from './front-office/promotion-front/promotion-front.component';
import { MapComponent } from './front-office/map/map.component';
import { ConfirmDeliveryComponent } from './front-office/livraison/confirm-delivery/confirm-delivery.component';

import { NutritionistComponent } from './front-office/nutritionist/nutritionist.component';
import { MeetingComponent } from './front-office/nutritionist/meeting/meeting.component';
import { MedicalfolderComponent } from './front-office/nutritionist/medicalfolder/medicalfolder.component';
import { NewMeetingComponent } from './front-office/nutritionist/meeting/new-meeting/new-meeting.component';
import { UpdatemeetingComponent } from './front-office/nutritionist/meeting/updatemeeting/updatemeeting.component';
import { ShowmeetingComponent } from './front-office/nutritionist/meeting/showmeeting/showmeeting.component';
import { ShowmedicalfolderComponent } from './front-office/nutritionist/medicalfolder/showmedicalfolder/showmedicalfolder.component';
import { NewmedicalfolderComponent } from './front-office/nutritionist/medicalfolder/newmedicalfolder/newmedicalfolder.component';
import { SlotSelectorComponent } from './front-office/nutritionist/meeting/slot-selector/slot-selector.component';
import { UpdatemedicalfolderComponent } from './front-office/nutritionist/medicalfolder/updatemedicalfolder/updatemedicalfolder.component';
import { BacknutritionistComponent } from './back-office/backnutritionist/backnutritionist.component';




import { LoadingSpinnerComponent } from './front-office/loading-spinner/loading-spinner.component';
import { RegisterNutrusionistComponent } from './front-office/auth/register-nutrusionist/register-nutrusionist.component';
import { RouterModule } from '@angular/router';
import {NgChartsModule} from "ng2-charts";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    StoreComponent,
    ProductsComponent,
    ProductDetailComponent,
    LoginComponent,
    RegisterComponent,
    UserprofileComponent,
    AllTemplateFrontComponentComponent,
    AllTemplateBackComponentComponent,
    NavbarComponent,
    SidebarComponent,
    FooterBackComponent,
    TrainingSessionComponent,
    ClubsPacksComponent,
    NutritionistComponent,
    MeetingComponent,
    MapComponent,
    MedicalfolderComponent,
    NewMeetingComponent,
    UpdatemeetingComponent,
    ShowmeetingComponent,
    ShowmedicalfolderComponent,
    NewmedicalfolderComponent,
    SlotSelectorComponent,
    UpdatemedicalfolderComponent,
    LivraisonComponent,
    BacknutritionistComponent,
    PromotionFrontComponent,
    CategoriesComponent,
    NotificationComponent,
    CartCounterComponent,
    FooterBackComponent,
    ResetPasswordComponent,
    ClubPerformanceComponent,
    ForgotPasswordComponent,
    RegisterOwnerComponent,
    SuccessComponent,
    AuthComponent,
    UsersComponent,
    TrophiesComponent,
    NutritionComponent,
    RecipeComponent,
    MealPlanComponent,
    DietProgramComponent,
    TrainingSessionComponent,
    ChatComponent,
    NutritionistAIComponent,
    FavoriterecipesComponent,
    ConfirmDeliveryComponent,
    PromotionComponent,

    LoadingSpinnerComponent,
    RegisterNutrusionistComponent,
    CategorieComponent,

    //ChatComponent
  ],
  imports: [
    NgChartsModule,
    ProductComponent,
    HttpClientModule,
    BrowserModule,
    clubreqModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right', // Positionner en bas à droite
      timeOut: 3000, // Durée de la notification (en ms)
      progressBar: true, // Ajouter une barre de progression
      closeButton: true, // Ajouter un bouton de fermeture
      preventDuplicates: true // Empêcher l'affichage de notifications en double
    }),
 
  providers: [ provideAnimations(), // required animations providers
    provideToastr(),],
  bootstrap: [AppComponent]
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    DragDropModule,
    NgScrollbarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
