import { NgModule } from '@angular/core';
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
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserprofileComponent } from './front-office/userprofile/userprofile.component';
import { AllTemplateFrontComponentComponent } from './front-office/all-template-front-component/all-template-front-component.component';
import { AllTemplateBackComponentComponent } from './back-office/all-template-back-component/all-template-back-component.component';
import { NavbarComponent } from './back-office/navbar/navbar.component';
import { SidebarComponent } from './back-office/sidebar/sidebar.component';
import { FooterBackComponent } from './back-office/footer-back/footer-back.component';
import { ResetPasswordComponent } from './front-office/auth/reset-password/reset-password.component';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './front-office/auth/forgot-password/forgot-password.component';
import { RegisterOwnerComponent } from './front-office/auth/register-owner/register-owner.component';
import { AuthComponent } from './back-office/auth/auth.component';
import { UsersComponent } from './back-office/users/users.component';


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
  ],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule ,
    FormsModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
