import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from "./front-office/store/store.component";
import { ProductsComponent } from "./front-office/store/products/products.component";
import { ProductDetailComponent } from "./front-office/store/product-detail/product-detail.component";
import { HomeComponent } from "./front-office/home/home.component";
import { LoginComponent } from './front-office/auth/login/login.component';
import { RegisterComponent } from './front-office/auth/register/register.component';
import { ForgotPasswordComponent } from './front-office/auth/forgot-password/forgot-password.component';
import { UserprofileComponent } from './front-office/userprofile/userprofile.component';
import { AllTemplateFrontComponentComponent } from './front-office/all-template-front-component/all-template-front-component.component';
import { AllTemplateBackComponentComponent } from './back-office/all-template-back-component/all-template-back-component.component';
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








const routes: Routes = [

  { 
  path: 'admin', component: AllTemplateBackComponentComponent, children: [ 
    { path: 'nutritionist', component: BacknutritionistComponent  , children: [

      
    
     
    ]
  }
  ] 
},




// redirect to home if no path is wrong 


  { path: '', component: AllTemplateFrontComponentComponent, children: [ // Home route
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
  },
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
  }]
},
{ path: '**', redirectTo: '/' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
