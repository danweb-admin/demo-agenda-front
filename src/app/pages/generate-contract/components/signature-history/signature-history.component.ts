import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GenerateContractService } from 'src/app/shared/services/generate-contract.service';


@Component({
  selector: 'app-signature-history',
  templateUrl: './signature-history.component.html',
  styleUrls: ['./signature-history.component.scss'],
})
export class SignatureHistoryComponent implements OnInit {
  public dataSource: any[] = [];
  constructor(private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SignatureHistoryComponent>,
    private generateContractService: GenerateContractService,
  ) {
    
  }
  
  public ngOnInit(): void {
    this.getHistory();
  }
  
  getHistory(){
    
    this.generateContractService.history(this.data.item.id).subscribe((resp: any) => {
      
      this.dataSource = resp; 
      console.log(resp)
    });
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
