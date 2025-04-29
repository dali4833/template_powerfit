import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { TrophiesRoutingModule } from './Trophy-routing.module';
import { EditaddComponent } from './editadd/editadd.component';

@NgModule({
  declarations: [ 
    EditaddComponent,
    ListComponent,
   ],
  imports: [
   
    CommonModule,
    TrophiesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    ListComponent,
    EditaddComponent,
    TrophiesRoutingModule,
  ]
})
export class TrophyModule { }