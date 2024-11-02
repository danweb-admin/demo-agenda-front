import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const URL_EQUIPAMENT_RELATIONSHIP = '/api/v1/equipment-relationship';

@Injectable({
  providedIn: 'root'
})
export class EquipmentRelationshipService {
  
  constructor(private http: HttpClient){

  }

  loadEquipmentRelationship(): Observable<any[]> {
    return this.http.get(`${environment.URL_API}${URL_EQUIPAMENT_RELATIONSHIP}?ativo=true`)
    .pipe(map((resp: any[]) => {
      return resp;
    }));
  }

}
