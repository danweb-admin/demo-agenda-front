import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ClientEquipment } from 'src/app/shared/models/client-equipment';
import { Consumable } from 'src/app/shared/models/consumable';
import { Equipament } from 'src/app/shared/models/equipament';
import { ClientEquipmentService } from 'src/app/shared/services/client-equipment.service';
import { EquipmentRelationshipService } from 'src/app/shared/services/equipment-relationship.service';

@Component({
    selector: 'app-client-equipment-dialog',
    templateUrl: 'client-equipment-dialog.component.html',
    styleUrls: ['./client-equipment-dialog.component.scss']
})
export class ClientEquipmentDialogComponent implements OnInit {
    
    form: FormGroup;
    array: any[] = [];
    
    constructor(
        public dialogRef: MatDialogRef<ClientEquipmentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private clientEquipmentService: ClientEquipmentService,

        private equipmentRelantionshipService: EquipmentRelationshipService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService) {}
        
        
        ngOnInit(): void {
            this.loadEquipmentRelationship();
            this.createForm();
        }
        
        public createForm(){
            let arr = [];
            
            this.form = this.formBuilder.group({
                clientId:  [this.data.element?.clientId],
                clientName: [this.data.element?.clientName],
                equipmentId: [this.data.element?.equipNames.split(',')]
            });
        }

        loadEquipmentRelationship(){
            this.equipmentRelantionshipService.loadEquipmentRelationship().subscribe((resp: any[]) => {
                this.array = resp;
            });
        }
        
        onNoClick(): void {
            this.dialogRef.close();
        }
        
        onSubmit(){
            this.clientEquipmentService.save(this.form.value).subscribe((resp: ClientEquipment) => {
                this.toastr.success('Especificação adicionada.');
                this.dialogRef.close(resp);
            });
        }
        
    }