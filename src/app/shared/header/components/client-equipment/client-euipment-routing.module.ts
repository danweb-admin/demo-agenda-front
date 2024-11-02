import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientEquipmentPageComponent } from './containers/client-equipment-page.component';


const routes: Routes = [
  {
    path: '',
    component: ClientEquipmentPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class ClientEquipmentRoutingModule {
}
