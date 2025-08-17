import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InvoicingPageComponent } from './container/invoicing-page.component';


const routes: Routes = [
  {
    path: '',
    component: InvoicingPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class InvoicingRoutingModule {
}
