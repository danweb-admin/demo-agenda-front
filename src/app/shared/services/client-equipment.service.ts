import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ClientEquipment } from '../models/client-equipment';
import { Consumable } from '../models/consumable';

const URL_CLIENT_EQUIPMENT = '/api/v1/client/client-equipment';


@Injectable({
  providedIn: 'root'
})
export class ClientEquipmentService {
  
  constructor(private http: HttpClient){

  }

  loadClientEquipment(search: string): Observable<ClientEquipment[]> {
    return this.http.get(`${environment.URL_API}${URL_CLIENT_EQUIPMENT}/?clientName=${search}`)
    .pipe(map((resp: ClientEquipment[]) => {
      return resp;
    }));
  }

  save(clientEquipment: ClientEquipment): Observable<ClientEquipment>{
    return this.http.put(`${environment.URL_API}${URL_CLIENT_EQUIPMENT}`,clientEquipment)
    .pipe(map((resp: ClientEquipment) => {
      return resp;
    }));
  }

}
