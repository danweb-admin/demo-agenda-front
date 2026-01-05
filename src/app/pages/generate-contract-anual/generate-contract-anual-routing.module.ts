import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { GenerateContractAnualPageComponent } from './containers/generate-contract-anual-page/generate-contract-anual-page.component';


const routes: Routes = [
    {
        path: '',
        component: GenerateContractAnualPageComponent
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class GenerateContractAnualRoutingModule {
}
