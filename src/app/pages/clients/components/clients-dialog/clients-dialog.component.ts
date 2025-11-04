import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { City } from 'src/app/shared/models/city';
import { State } from 'src/app/shared/models/state';
import { EstadosCidadesServices } from 'src/app/shared/services/estados-cidades.service';
import { Client } from '../../../../shared/models/client';
import { ClientsService } from '../../../../shared/services/clients.service';
import { log } from 'console';
import { MatCheckbox } from '@angular/material/checkbox';
import { Guid } from 'guid-typescript';

@Component({
    selector: 'app-clients-dialog',
    templateUrl: 'clients-dialog.component.html',
    styleUrls: ['./clients-dialog.component.scss']
  })
  export class ClientsDialogComponent implements OnInit, AfterViewInit {
    form: FormGroup;
    isAddMode: boolean;
    id: string;
    isPhysicalPerson: boolean;
    estados: State[];
    arrayEstados: State[];
    cidades: City[];
    arrayCidades: City[];
    valuesArray: any[] = [];
    clientEquipmentArray: any[] = [];
    clientSpecificationArray: any[] = [];
    clientDigitalSignaturesArray: any[] = [];
    specificationList: any[] = [];
    @ViewChild('estado') selectEstado: MatSelect;
    @ViewChild('cidade') selectCidade: MatSelect;
    @ViewChild('stateInputSearch') stateInputSearch: any;
    @ViewChild('cityInputSearch') cityInputSearch: any;
    @ViewChild('valueInput') valueInput: any;
    @ViewChild('spec') spec: any;
    @ViewChild('hours') hours: any;
    @ViewChild('specValue') specValue: any;
    @ViewChild('nome') nome: any;
    @ViewChild('email') email: any;
    @ViewChild('parte') parte: any;
    @ViewChild('pf') pf: MatCheckbox;

    expandedIndex: number | null = null;
    leftColumn: any[] = [];
    rightColumn: any[] = [];

    constructor(
      public dialogRef: MatDialogRef<ClientsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private clientService: ClientsService,
      private formBuilder: FormBuilder,
      private toastr: ToastrService,
      private estadosCidadesService: EstadosCidadesServices,
      private cdRef: ChangeDetectorRef) {
    }

    openPanel(index: number) {
      if (this.expandedIndex === index) {
        this.expandedIndex = null;
      } else {
        this.expandedIndex = index;
      }
    }

    ngAfterViewInit(): void {
      this.specificationList = JSON.parse(localStorage.getItem('specificationsList'));
      
      if (this.data.element?.cityId != null){
        setTimeout(() => {
          this.selectEstado.options.filter(item => item.value == this.data.element?.stateId)[0].select();
        },500);
      }
      this.ajustesCSS();
    }

    createForm(){
      this.id = this.data.element;
      this.isAddMode = !this.id;
      console.log(this.data)
      this.form = this.formBuilder.group({
        id:  [this.data.element?.id || ''],
        name: [this.data.element?.name || '', Validators.required],
        responsible: [this.data.element?.responsible || ''],
        specialty: [this.data.element?.specialty || ''],
        clinicName: [this.data.element?.clinicName || ''],
        landMark: [this.data.element?.landMark || ''],
        zipCode: [this.data.element?.zipCode || ''],
        neighborhood: [this.data.element?.neighborhood || ''],
        cellPhone: [this.data.element?.cellPhone || ''],
        clinicCellPhone: [this.data.element?.clinicCellPhone || ''],
        phone: [this.data.element?.phone || ''],
        active: [this.data.element?.active || true, Validators.required],
        createdAt: [this.data.element?.createdAt || new Date()],
        updatedAt: [this.data.element?.updatedsAt || null],
        email: [this.data.element?.email || null],
        address: [this.data.element?.address || '', Validators.required],
        number: [this.data.element?.number || '', Validators.required],
        cnpj: [this.data.element?.cnpj || ''],
        ie: [this.data.element?.ie || ''],
        cpf: [this.data.element?.cpf || ''],
        rg: [this.data.element?.rg || ''],
        discount: [this.data.element?.discount || 0],
        freight: [this.data.element?.freight || 0],
        secretary: [this.data.element?.secretary || ''],
        complement: [this.data.element?.complement || ''],
        cityId: [this.data.element?.cityId || '', Validators.required],
        stateId: [this.data.element?.stateId || '', Validators.required],
        isAnnualContract: [this.data.element?.isAnnualContract],
        isReceipt: [this.data.element?.isReceipt],
        hasAirConditioning: [this.data.element?.hasAirConditioning],
        nameForReceipt: [this.data.element?.nameForReceipt || ''],
        takeTransformer: [this.data.element?.takeTransformer],
        has220V: [this.data.element?.has220V],
        hasStairs: [this.data.element?.hasStairs],
        hasTechnique: [this.data.element?.hasTechnique],
        techniqueOption1: [this.data.element?.techniqueOption1 || ''],
        techniqueOption2: [this.data.element?.techniqueOption2 || ''],
        equipamentValues: [this.data.element?.equipamentValues || ''],
        equipmentValues: this.formBuilder.array(this.valuesArray),
        clientEquipment: this.formBuilder.array([]),
        clientSpecifications: this.formBuilder.array([]),
        clientDigitalSignatures: this.formBuilder.array([]),

      });
      this.isPhysicalPerson = this.data.element? this.data.element.isPhysicalPerson : false;
    }

    get clientEquipment(): FormArray {
      return this.form.get('clientEquipment') as FormArray;
    }

    get clientSpecifications(): FormArray {
      return this.form.get('clientSpecifications') as FormArray;
    }

    get clientDigitalSignatures(): FormArray {
      return this.form.get('clientDigitalSignatures') as FormArray;
    }

    getTimeValues(equipmentIndex: number): FormArray {
      return this.clientEquipment.at(equipmentIndex).get('timeValues') as FormArray;
    }

    ngOnInit(): void {
      this.getEstados();
      this.getById(this.data.element?.id);
      this.createForm();    
    }

    addSpecValue(event: Event){
      event.preventDefault();
    
      let _specValue = this.specValue.nativeElement.value
      let _hours = this.hours.nativeElement.value
      let _spec = this.spec.value
      let _specText = this.spec.selected?.viewValue

      if (_spec == undefined){
        this.toastr.warning("Selecione uma Ponteira");
        return;
      }

      if (_specValue == "R$ " || _specValue == ""){
        this.toastr.warning("Informe o Valor da Ponteira");
        return;
      }

      if (_hours == ""){
        this.toastr.warning("Informe o campo Até Quantas Horas");
        return;
      }

      const clientSpecForm = this.formBuilder.group({
        spec: [_spec],
        specName: [_specText],
        hours: [_hours],
        value: [_specValue],
        clientId: [this.data.element?.id],
        specificationId: [_spec]
      });

      this.clientSpecifications.push(clientSpecForm);
  
      this.spec.value = ''
      this.hours.nativeElement.value = '0'
      this.specValue.nativeElement.value = ''
      this.cdRef.detectChanges();
    }

    addSignatario(event: Event){
      event.preventDefault();
      
      let nome = this.nome.nativeElement.value
      let email = this.email.nativeElement.value
      let parte = this.parte.value
      let pf = this.pf.checked

      if (nome == undefined || nome == ""){
        this.toastr.warning("Informe o Nome");
        return;
      }
 
      if (email == undefined || email == ""){
        this.toastr.warning("Informe o Email");
        return;
      }

      if (!this.validarEmail()){
        this.toastr.warning("Email é inválido");
        return;
      }

      let clientId = this.form.value.id;

      const formGroup = this.formBuilder.group({
					clientId: [clientId],
          id: [Guid.create().toString()],
					active: [true],
          email:[email],
          isPF: [pf],
          name: [nome],
          partyName: [parte],
          createdAt: [new Date()]

				});

      this.clientDigitalSignatures.push(formGroup);
  
      this.nome.nativeElement.value = ''
      this.email.nativeElement.value = ''
      this.parte.value = ''
      this.pf.checked = false;
      this.cdRef.detectChanges();
    }

    validarEmail() {
      const valor = this.email.nativeElement.value;
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (regexEmail.test(valor)) {
        return true
      } else {
        return false
      }
    }

    removeSpecs(event: Event,i){
      event.preventDefault();

      this.clientSpecifications.removeAt(i);
    }

    removeSignatarios(event: Event,i){
      event.preventDefault();

      this.clientDigitalSignatures.removeAt(i);
    }

    getById(id){
      if (id == undefined)
        id = ''
      this.clientService.getById(id).subscribe((resp: any) => {
        this.valuesArray = resp.clientEquipment;
        this.clientSpecificationArray = resp.clientSpecifications;
        this.clientDigitalSignaturesArray = resp.clientDigitalSignatures;

				this.createValuesForms();
        this.createClientSpecificationsForms();
        this.createClientDigitalSignaturesForms();

      }); 
    }

    createValuesForms(){
      this.valuesArray.forEach(item => {
				
				const formGroup = this.formBuilder.group({
					clientId: [item.clientId],
					equipmentRelationshipId: [item.equipmentRelationshipId],
          id: [item.id],
          name: [item.name],
					timeValues: this.formBuilder.array([])
				});
				
				this.clientEquipment.push(formGroup);
        
        item.timeValues.forEach(timeValue => {
          this.addTimeValue(this.clientEquipment.length - 1, timeValue);
        });
			});
    }

    createClientEquipmentForms(){
      this.clientEquipmentArray.forEach(item => {
				
				const formGroup = this.formBuilder.group({
					clientId: [item.clientId],
					specificationId: [item.equipmentRelationshipId],
          id: [item.id],
          name: [item.name],
					timeValues: this.formBuilder.array([])
				});
				
				this.clientEquipment.push(formGroup);
        
        item.timeValues.forEach(timeValue => {
          this.addTimeValue(this.clientEquipment.length - 1, timeValue);
        });
			});
    }

    createClientSpecificationsForms(){
      this.clientSpecificationArray.forEach(item => {
				
				const formGroup = this.formBuilder.group({
					clientId: [item.clientId],
					specificationId: [item.specificationId],
          id: [item.id],
          hours: [item.hours],
          value: [item.value],
          specName: [item.specification.name]
				});
				
				this.clientSpecifications.push(formGroup);
			});
    }

    createClientDigitalSignaturesForms(){
      this.clientDigitalSignaturesArray.forEach(item => {
				const formGroup = this.formBuilder.group({
					clientId: [item.clientId],
					active: [item.active],
          email:[item.email],
          id:[item.id],
          isPF: [item.isPF],
          name: [item.name],
          partyName: [item.partyName],
          createdAt: [item.createdAt]

				});
				
				this.clientDigitalSignatures.push(formGroup);
			});
    }

    describeIsPF(value){
      if (value)
        return 'Sim'
      return 'Não'
    }


    addTimeValue(equipmentIndex: number, timeValue: any = null): void {
      
      const timeValueForm = this.formBuilder.group({
        id: [timeValue.id],
        time: [timeValue.time],
        value: [timeValue.value.toFixed(2).replace('.',',')]
      });
  
      this.getTimeValues(equipmentIndex).push(timeValueForm);
    }


    onNoClick(): void {
      this.dialogRef.close();
    }

    getEstados(){
      this.estadosCidadesService.getEstados().subscribe((resp: State[]) => {
        this.estados = resp;
        this.arrayEstados = resp;
      });
    }

    getCidadesByEstado(estado_id: number){
      this.estadosCidadesService.getCidadesByEstado(estado_id).subscribe((resp: City[]) => {
        this.cidades = resp;
        this.arrayCidades = resp;
      });
      if (this.data.element?.cityId != null){
        setTimeout(() => {
          this.selectCidade.options.filter(item => item.value == this.data.element?.cityId)[0].select();
        },500);
      }
      
    }

    openedState(value): void {
      this.stateInputSearch.nativeElement.focus();
    }

    openedCity(): void {
      this.cityInputSearch.nativeElement.focus();
    }

    onKeyState(value): void{
      this.arrayEstados = []
      let filter = value.toLowerCase();
      for ( let i = 0; i < this.estados.length; i++){
        let option = this.estados[i];
        if (option.nome.toLowerCase().indexOf(filter) >= 0){
          this.arrayEstados.push(option);
        }
      }
    }

    onKeyCity(value): void{
      this.arrayCidades = []
      let filter = value.toLowerCase();
      for ( let i = 0; i < this.cidades.length; i++){
        let option = this.cidades[i];
        if (option.nome.toLowerCase().indexOf(filter) >= 0){
          this.arrayCidades.push(option);
        }
      }
    }

    onSubmit(){
      this.adjustFormValues();
      if (this.form.value.id === ""){
        this.clientService.save(this.form.value).subscribe((resp: Client) => {
          this.toastr.success('Cliente adicionado.');
          this.dialogRef.close(resp);
        });
      } else {
        this.clientService.update(this.form.value).subscribe((resp: Client) => {
          this.toastr.success('Cliente atualizado!');
          this.dialogRef.close(resp);
        });
      }
    }

    adjustFormValues(){
			this.clientEquipment.controls.forEach((item) => {

        const timeValues = (item.get('timeValues') as FormArray).controls;

        timeValues.forEach(subItem => {
          const currentValue = subItem.get('value').value.toString();
				  const newValue  = currentValue.replace(',', '.');
          subItem.get('value').patchValue(newValue);
        });
			}); 

      this.clientSpecifications.controls.forEach((item) => {
        const currentValue = item.get('value').value.toString();
        const newValue  = currentValue.replace('R$ ','').replace(',', '.');
        item.get('value').patchValue(newValue);
			}); 
		}

    applyValue(index){
      var value = this.valueInput.nativeElement.value.replace('R$ ','');
      var soma = 0;

      if (value == ""){
        this.toastr.info("Informe um valor!");
        return
      }
      this.getTimeValues(index).controls.forEach((item, i) => {
        if (i == 0){
          const currentValue = item.get('value').value.toString();
				  const newValue  = currentValue.replace(',', '.');
          soma +=  parseFloat(newValue);
        }else{
          const currentValue = item.get('value').value.toString();
				  const newValue  = currentValue.replace(',', '.');
          soma += parseFloat(value.replace(',', '.'));
          item.get('value').patchValue(soma.toFixed(2).replace('.',','));
        }
      })
      
    }

    ajustesCSS(){
      var mat_select = document.getElementsByClassName('mat-select');
      var mat_dialog = document.getElementsByClassName('mat-dialog-content');
      if (mat_dialog.length > 0){
        mat_dialog[0].setAttribute('style','overflow-y: hidden');
      }
      for (var i = 0; i < mat_select.length; i++) {
        mat_select[i].setAttribute('style', 'display: contents');
      }
    }

    allowOnlyNumbers(event: KeyboardEvent): boolean {
      const charCode = event.which ? event.which : event.keyCode;
      // Permite apenas números (0-9)
      if (charCode < 48 || charCode > 57) {
        event.preventDefault(); // Bloqueia qualquer outro caractere que não seja número
        return false;
      }
      return true;
    }
  }