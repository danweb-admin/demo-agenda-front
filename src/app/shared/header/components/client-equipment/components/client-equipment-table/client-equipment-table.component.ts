import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';
import { CustomPaginator } from 'src/app/shared/shared';
import { Client } from 'src/app/shared/models/client';
import { ClientsService } from 'src/app/shared/services/clients.service';
import { ClientEquipmentDialogComponent } from '../client-equipment-dialog/client-equipment-dialog.component';
import { ClientEquipmentService } from 'src/app/shared/services/client-equipment.service';
import { ClientEquipment } from 'src/app/shared/models/client-equipment';


@Component({
  selector: 'app-client-equipment-table',
  templateUrl: './client-equipment-table.component.html',
  styleUrls: ['./client-equipment-table.component.scss']
})
export class ClientEquipmentTableComponent implements OnInit {
  public displayedColumns: string[] = ['nome', 'equipamentos'];
  public dataSource: MatTableDataSource<ClientEquipment> = new MatTableDataSource<ClientEquipment>();
  public selection = new SelectionModel<ClientEquipment>(true, []);
  public selectedTabIndex = 0;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('inputSearch') inputSearch: ElementRef;

  constructor(public dialog: MatDialog, 
    private clientEquipmentService: ClientEquipmentService) {}

  public ngOnInit(): void {
    this.getClientEquipment('');
  }

  applyFilter(event: Event): void {
    let length = this.inputSearch.nativeElement.value.length;
    
    if (length > 2){
      const filterValue = (event.target as HTMLInputElement).value;
      this.getClientEquipment(filterValue); 
    }
  }

  closeFilterInput(): void {
    this.inputSearch.nativeElement.value = '';
    this.getClientEquipment(''); 
  }


  openDialog(element: Client): void {
    
    const dialogRef = this.dialog.open(ClientEquipmentDialogComponent, {
      width: '600px',
      height: '500px',
      disableClose: true,
      data: {element}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined)
        return;        
    });
  }


  private getClientEquipment(search: string){
    
    this.clientEquipmentService.loadClientEquipment(search).subscribe((resp: ClientEquipment[]) => {
      this.dataSource = new MatTableDataSource<ClientEquipment>();
      this.dataSource = new MatTableDataSource<ClientEquipment>(resp);
      this.dataSource.paginator = this.paginator;

    });

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = CustomPaginator();
    }
  }
}