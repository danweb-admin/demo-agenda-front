import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from '../../../../shared/services/clients.service';
import { EquipamentsService } from '../../../../shared/services/equipaments.service';
import { SpecificationsService } from 'src/app/shared/services/specifications.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CalendarService } from 'src/app/shared/services/calendar.service';
import { MY_FORMATS } from 'src/app/consts/my-format';
import { Calendar } from 'src/app/shared/models/calendar';
import { SelectionModel } from '@angular/cdk/collections';
import { Specification } from 'src/app/shared/models/specification';
import { Equipament } from 'src/app/shared/models/equipament';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PersonService } from 'src/app/shared/services/people.service';
import { Person } from 'src/app/shared/models/person';
import * as html2pdf from 'html2pdf.js';

@Component({
    selector: 'app-invoicing-table',
    templateUrl: 'invoicing-table.component.html',
    styleUrls: ['./invoicing-table.component.scss',],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
})
export class InvoicingTableComponent implements OnInit, AfterViewInit{
    displayedColumns: string[] = ['clientName','equipmentName','discount','freight','others','value','totalValue'];
    @ViewChild('inputSearch') inputSearch: ElementRef;
    dataSource: any[];
    selection = new SelectionModel<any>(true, []);
    groupedData: { date: string, items: any[] }[] = [];
    selectedTabIndex = 0;
    specificationArray: Specification[];
    equipamentResult: Equipament[];
    disableButton: boolean = true;
    clientResult: [];
    inputReadonly = false;
    isLoading = false;
    notFound = false;
    form: FormGroup;
    techniqueResult: Person[];
    driverResult: Person[];
    currentDateTime: Date = new Date();
    
    constructor(private calendarService: CalendarService,
        public dialog: MatDialog,
        private specificationSerivce: SpecificationsService,
        private personService: PersonService,
        private formBuilder: FormBuilder,
        private equipamentService: EquipamentsService,
        private clientService: ClientsService,
        private cdr: ChangeDetectorRef) {
        }
        ngAfterViewInit(): void {
            this.ajusteCSS();
        }
        
        ngOnInit(): void {
            this.loadSpecifications();
            this.getEquipaments();
            
            this.form = this.formBuilder.group({
                startDate: [null, Validators.required],
                endDate: [null, Validators.required],
                client: [null],
                equipamentId: [],
                status: [null]
            });
            this.onChanges();
        }
        
        onChanges(){
            this.form.get('client').valueChanges.pipe(
                filter( data => {
                    if (typeof data === 'string' || data instanceof String){
                        if (data.trim().length <= 2){
                            this.isLoading = true;
                            this.notFound = false;
                            this.clientResult = [];
                        }
                        return data.trim().length > 2
                    }
                }),
                debounceTime(500),
                switchMap(  (search: string) => {
                    return search ? this.clientService.getClients(true,search) : of([]);
                })
            ).subscribe(data =>{
                this.clientResult = data as [];
                if (this.clientResult.length == 0)
                    this.notFound = true
                else
                this.isLoading = false;
            })
        }
        
        async loadSpecifications(): Promise<void> {
            await this.specificationSerivce.loadSpecifications().toPromise().then((data) => {
                localStorage.setItem('specificationsList',JSON.stringify(data));
                this.specificationArray = data;
            }); 
        }
        
        displayFn(item) {
            if (item === null)
                return;
            return item?.name;
        }
        
        descriptionSpecifications(item: Calendar){
            let retorno = new Array();
            item.calendarSpecifications.forEach(obj => {
                if (obj.active === true){
                    let name = this.specificationArray?.find(x => x.id === obj.specificationId);
                    if (name){
                        retorno.push(name.name);
                    }
                }   
            });
            return retorno.join(' - ')
        }
        
        showTime(item: Calendar){
            let start = ''
            let end = '';
            if (item.startTime)
                start = item.startTime.substring(11,16);
            if (item.endTime)
                end = item.endTime.substring(11,16)
            return start + ' - ' + end;
        }
        
        showClientCity(item){
            let ret = [];
            if (item.noCadastre){
                ret.push(item.temporaryName);
            }else{
                let split = item.client.name.split(' ');
                if (split.length > 1){
                    ret.push(split[0] + ' ' + split[1]);
                }else{
                    ret.push(split[0]);
                }
                ret.push(item.client.city.nome)
            }
            
            return ret.join(' - ');
        }
        
        getSubTotal(items: any[], field: keyof any): number {
            return items.reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
        }
        
        statusToString(status){
            let ret = 'Confirmada';
            
            if (status == '2'){
                ret = 'Pendente';
            }else if (status == '3'){
                ret = 'Cancelada';
            }else if (status == '4'){
                ret = 'Excluida';
            }else if (status == '5'){
                ret = 'Pre-Agendada';
            }
            
            return ret;
        }
        
        onSubmit(): void{
            let startDate = this.form.value.startDate.format('yyyy-MM-DD');
            let endDate = this.form.value.endDate.format('yyyy-MM-DD');
            let clientId = '';
            let equipamentId = this.form.value.equipamentId === null ? '' : this.form.value.equipamentId;
            let status = this.form.value.status === null ? '' : this.form.value.status;
            
            if (this.form.value.client !== null && this.form.value.client !== ''){
                clientId = this.form.value.client.id;
            }
            
            this.calendarService.invoicing(startDate, endDate, clientId, equipamentId, status)
            .subscribe((resp: any[]) => {
                
                this.dataSource = resp;
                this.groupByDate()
                this.disableButton = false;
                this.currentDateTime = new Date();
            })
        }
        
        groupByDate() {
            const groups: { [key: string]: any[] } = {};
            
            this.dataSource.forEach(item => {
                const date = item.date.split('T')[0]; // só a parte da data
                if (!groups[date]) groups[date] = [];
                groups[date].push(item);
            });
            
            this.groupedData = Object.keys(groups).map(date => ({
                date,
                items: groups[date]
            }));
        }
        
        gerarPDF() {
            const element = document.getElementById('report');
            
            if (element) {
                const opt = {
                    margin:       10,
                    filename:     'arquivo.pdf',
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2 },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' },
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                };
                
                html2pdf().from(element).set(opt).save();
            }
        }
        
        getEquipaments(): void{
            this.equipamentService.loadEquipaments(true).subscribe((resp: Equipament[]) => {
                this.equipamentResult = resp;
            })
        }
        
        ajusteCSS(): void {
            document
            .querySelectorAll<HTMLElement>('.header__title-button-icon')
            .forEach(node => node.click())
        }
    }