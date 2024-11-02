import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientEquipmentRoutingModule } from './client-euipment-routing.module';
import { ClientEquipmentPageComponent } from './containers/client-equipment-page.component';
import { ClientEquipmentDialogComponent } from './components/client-equipment-dialog/client-equipment-dialog.component';
import { ClientEquipmentTableComponent } from './components/client-equipment-table/client-equipment-table.component';
import { ClientEquipmentService } from 'src/app/shared/services/client-equipment.service';

@NgModule({
  declarations: [
      ClientEquipmentPageComponent,
      ClientEquipmentTableComponent,
      ClientEquipmentDialogComponent,
  ],
  imports: [
    CommonModule,
    ClientEquipmentRoutingModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
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
      ClientEquipmentService
  ]
})
export class ClientEquipmentModule { }
