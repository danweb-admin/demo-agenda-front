import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PriceTablePageComponent } from './containers/price-table-page/price-table-page.component';


const routes: Routes = [
  {
    path: '',
    component: PriceTablePageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class PriceTableRoutingModule {
}
