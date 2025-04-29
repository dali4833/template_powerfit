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
import { ResetPasswordComponent } from './front-office/auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './front-office/auth/forgot-password/forgot-password.component';
import { RegisterOwnerComponent } from './front-office/auth/register-owner/register-owner.component';
import { AuthComponent } from './back-office/auth/auth.component';
import { UsersComponent } from './back-office/users/users.component';
import { TrainingSessionComponent } from './front-office/pages/training-session/training-session.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChatComponent } from './front-office/pages/chat/chat.component';
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

import { LoadingSpinnerComponent } from './front-office/loading-spinner/loading-spinner.component';
import { RegisterNutrusionistComponent } from './front-office/auth/register-nutrusionist/register-nutrusionist.component';
import { RouterModule } from '@angular/router';

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
    ResetPasswordComponent,
    ForgotPasswordComponent,
    RegisterOwnerComponent,
    AuthComponent,
    UsersComponent,
    TrainingSessionComponent,
    ChatComponent,
    CategoriesComponent,
    CartCounterComponent,
    NotificationComponent,
    CategorieComponent,
    ProductComponent,
    SuccessComponent,
    PromotionComponent,
    LivraisonComponent,
    PromotionFrontComponent,
    MapComponent,
    ConfirmDeliveryComponent
    SuccessComponent,
    LoadingSpinnerComponent,
    RegisterNutrusionistComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
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
