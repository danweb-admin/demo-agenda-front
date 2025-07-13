import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModelService } from 'src/app/shared/services/model.service';
import moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/app/consts/my-format';
import { GenerateContractService } from 'src/app/shared/services/generate-contract.service';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from "file-saver";
import { MatDialog } from '@angular/material/dialog';
import { SignatureHistoryComponent } from '../signature-history/signature-history.component';


@Component({
  selector: 'app-generate-contract-table',
  templateUrl: './generate-contract-table.component.html',
  styleUrls: ['./generate-contract-table.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class GenerateContractTableComponent implements OnInit {
  public dataSource: any[] = [];
  @ViewChild('inputSearch') inputSearch: ElementRef;
  time;
  
  constructor(private modelService: ModelService,
    private generateContractService: GenerateContractService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.time = moment();
  }
  
  public ngOnInit(): void {
    this.getCalendars();
  }
  
  today(){
    window.location.reload();
  }
  
  followingDay(): void {
    
    this.time = moment(this.time, 'DD-MM-YYYY', true).add(1,'days');
    this.ngOnInit();
  }
  
  lastDay(): void {
    this.time = moment(this.time, 'DD-MM-YYYY', true).add(-1,'days');
    this.getCalendars();
  }
  
  applyFilter(event){
    this.time = moment(this.inputSearch.nativeElement.value, 'DD-MM-YYYY', true);
    this.getCalendars();
  }
  
  
  loadModels(){
    this.modelService.loadModels().subscribe((resp: any[]) => {
      this.dataSource = resp;
    });
  }
  
  getCalendars(){
    this.time = moment(this.time, 'DD-MM-YYYY', true);
    let date = this.time.format('YYYY-MM-DD');
    
    this.generateContractService.getCalendars(date).subscribe((resp: any) => {
      this.dataSource = resp; 
    });
  }
  
  generateContract(item){
    this.generateContractService.generateContract(item).subscribe((resp: any) => {
      if (resp == null){
        this.toastr.success('Contrato gerado com sucesso!');
      }else{
        this.toastr.error('Erro para gerar o contrato!');
      }
      this.getCalendars();
    },
    (error: any) =>{
      console.log(error);
      
      this.toastr.warning(error.error)
    });
  }
  
  downloadContract(item){
    this.generateContractService.downloadContract(item.id)
    .subscribe(data => saveAs(data, item.contractPath));
  }
  
  digitalSignature(item){
    this.generateContractService.digitalSignature(item.id)
    .subscribe((resp: any) => {
      this.toastr.success('Contrato enviado para Assinatura Digital com sucesso.');
      // this.dataSource = resp; 
    },
    (error: any) =>{
      console.log(error)
    });
  }
  
  history(item): void {
    const dialogRef = this.dialog.open(SignatureHistoryComponent, {
      width: '900px',
      height: '600px',
      data: {item}
    });
    
  }
  
  
}
