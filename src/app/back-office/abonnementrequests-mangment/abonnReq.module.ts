import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { AbonnReqRoutingModule } from './abonnReq-routing.module';
import { EditaddComponent } from './editadd/editadd.component';

@NgModule({
  declarations: [
    ListComponent,
    EditaddComponent
  ],
  imports: [
    CommonModule,
    AbonnReqRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    ListComponent,
    EditaddComponent,
    AbonnReqRoutingModule,
  ]
})
export class AbonnReqModule { }