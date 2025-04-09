import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { ReviewRoutingModule } from './Review-routing.module';
import { EditaddComponent } from './editadd/editadd.component';

@NgModule({
  declarations: [
    ListComponent,
    EditaddComponent
  ],
  imports: [
    CommonModule,
    ReviewRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    ListComponent,
    EditaddComponent,
    ReviewRoutingModule,
  ]
})
export class ReviewModule { }