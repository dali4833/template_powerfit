import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';



import { HeaderComponent } from './front-office/header/header.component';
import { FooterComponent } from './front-office/footer/footer.component';
import { HomeComponent } from './front-office/home/home.component';
import { StoreComponent } from './front-office/store/store.component';
import { ProductsComponent } from './front-office/store/products/products.component';
import { ProductDetailComponent } from './front-office/store/product-detail/product-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './front-office/auth/login/login.component';
import { RegisterComponent } from './front-office/auth/register/register.component';
import { ForgotPasswordComponent } from './front-office/auth/forgot-password/forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserprofileComponent } from './front-office/userprofile/userprofile.component';
import { AllTemplateFrontComponentComponent } from './front-office/all-template-front-component/all-template-front-component.component';
import { AllTemplateBackComponentComponent } from './back-office/all-template-back-component/all-template-back-component.component';
import { NavbarComponent } from './back-office/navbar/navbar.component';
import { SidebarComponent } from './back-office/sidebar/sidebar.component';
import { FooterBackComponent } from './back-office/footer-back/footer-back.component';
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
import { AjoutnutriComponent } from 'src/app/back-office/backnutritionist/ajoutnutri/ajoutnutri.component';
import { ModifnutriComponent } from 'src/app/back-office/backnutritionist/modifnutri/modifnutri.component';
import { VoirnutriComponent } from 'src/app/back-office/backnutritionist/voirnutri/voirnutri.component';



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
    ForgotPasswordComponent,
    UserprofileComponent,
    AllTemplateFrontComponentComponent,
    AllTemplateBackComponentComponent,
    NavbarComponent,
    SidebarComponent,
    FooterBackComponent,
    NutritionistComponent,
    MeetingComponent,
    MedicalfolderComponent,
    NewMeetingComponent,
    UpdatemeetingComponent,
    ShowmeetingComponent,
    ShowmedicalfolderComponent,
    NewmedicalfolderComponent,
    SlotSelectorComponent,
    UpdatemedicalfolderComponent,
    BacknutritionistComponent,
    AjoutnutriComponent,
    ModifnutriComponent,
    VoirnutriComponent,
    
  ],
  imports: [
    ReactiveFormsModule,
    NgChartsModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule  // This includes all router configuration
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
