import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Equipament } from '../models/equipament';

const URL_PRICE_TABLE = '/api/v1/price-table';

@Injectable({
  providedIn: 'root'
})
export class PriceTableService {
  
  constructor(private http: HttpClient){
    
  }
  
  loadPriceTable(equipmentId: string): Observable<any[]> {
    return this.http.get(`${environment.URL_API}${URL_PRICE_TABLE}?equipmentId=${equipmentId}`)
    .pipe(map((resp: any[]) => {
      return resp;
    }));
  }
  
  save(valores: any): Observable<any>{
    
    return this.http.post(`${environment.URL_API}${URL_PRICE_TABLE}`,valores)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }
  
  getValueByEquipament(equipamentId: string, startTime: string, endTime: string): Observable<number> {
    return this.http.get(`${environment.URL_API}${URL_PRICE_TABLE}/value-by-equipment?equipmentId=${equipamentId}&startTime=${startTime}&endTime=${endTime}`)
    .pipe(map((resp: number) => {
      return resp;
    }));
  }
}
