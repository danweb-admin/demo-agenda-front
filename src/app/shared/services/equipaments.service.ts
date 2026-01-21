import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Equipament } from '../models/equipament';
import { Specification } from '../models/specification';

const URL_EQUIPAMENTS = '/api/v1/equipaments';
const URL_EQUIPMENT_RELATIONSHIP = '/api/v1/equipment-relationship';

@Injectable({
  providedIn: 'root'
})
export class EquipamentsService {
  
  constructor(private http: HttpClient){

  }

  loadEquipaments(ativo: boolean): Observable<Equipament[]> {
    return this.http.get(`${environment.URL_API}${URL_EQUIPAMENTS}?ativo=${ativo}`)
    .pipe(map((resp: Equipament[]) => {
      return resp;
    }));
  }

  loadEquipmentRelationship(ativo: boolean): Observable<Equipament[]> {
    return this.http.get(`${environment.URL_API}${URL_EQUIPMENT_RELATIONSHIP}?ativo=${ativo}`)
    .pipe(map((resp: Equipament[]) => {
      return resp;
    }));
  }

  save(equipament: Equipament): Observable<Equipament>{
    return this.http.post(`${environment.URL_API}${URL_EQUIPAMENTS}`,equipament)
    .pipe(map((resp: Equipament) => {
      return resp;
    }));
  }

  update(equipament): Observable<Equipament>{
    return this.http.put(`${environment.URL_API}${URL_EQUIPAMENTS}/${equipament.id}`,equipament)
    .pipe(map((resp: Equipament) => {
      return resp;
    }));
  }
}
