import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { SportsRoutingModule } from './sports-routing.module';
import { EditaddComponent } from './editadd/editadd.component';

@NgModule({
  declarations: [ 
    EditaddComponent,
    DetailsComponent,
    ListComponent,
   ],
  imports: [
   
    CommonModule,
    SportsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    DetailsComponent,
    ListComponent,
    EditaddComponent,
    SportsRoutingModule,
  ]
})
export class SportsModule { }