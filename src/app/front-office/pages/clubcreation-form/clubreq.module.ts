import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClubReqRoutingModule } from './clubreq-routing.module';
import { EditaddComponent } from './editadd/editadd.component';

@NgModule({
  declarations: [
    EditaddComponent
  ],
  imports: [
    CommonModule,
    ClubReqRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    EditaddComponent,
    ClubReqRoutingModule,
  ]
})
export class clubreqModule { }