import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditaddComponent } from './editadd/editadd.component';

const routes: Routes = [

  { 
    path: 'newclub', 
    component: EditaddComponent 
  },
  { 
    path: ':id/edit',
    component: EditaddComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubReqRoutingModule { }