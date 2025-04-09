import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { AbonnReqRoutingModule } from './abonnReq-routing.module';
import { EditaddComponent } from './editadd/editadd.component';

@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    EditaddComponent
  ],
  imports: [
    CommonModule,
    AbonnReqRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    DetailsComponent,
    ListComponent,
    EditaddComponent,
    AbonnReqRoutingModule,
  ]
})
export class AbonnReqModule { }