import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from '../../shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { PersonService } from '../../shared/services/people.service';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { MatTabsModule } from '@angular/material/tabs';
import { GenerateContractAnualPageComponent } from './containers/generate-contract-anual-page/generate-contract-anual-page.component';
import { GenerateContractAnualTableComponent } from './components/generate-contract-anual-table/generate-contract-anual-table.component';
import { GenerateContractAnualRoutingModule } from './generate-contract-anual-routing.module';

@NgModule({
  declarations: [
      GenerateContractAnualPageComponent,
      GenerateContractAnualTableComponent,
    //   SignatureHistoryComponent
  ],
  imports: [
    CommonModule,
    GenerateContractAnualRoutingModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTabsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
  providers: [
    PersonService
  ]
})
export class GenerateContractAnualModule { }
