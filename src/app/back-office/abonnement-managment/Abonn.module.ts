import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { AbonnRoutingModule } from './Abonn-routing.module';
import { EditaddComponent } from './editadd/editadd.component';

@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    EditaddComponent
  ],
  imports: [
    CommonModule,
    AbonnRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    DetailsComponent,
    ListComponent,
    EditaddComponent,
   AbonnRoutingModule,
  ]
})
export class AbonnModule { }