import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const URL_GENERATE_CONTRACT = '/api/v1/generate-contract';
const URL_DIGITAL_SIGNATURE = '/api/v1/assinatura-digital';


@Injectable({
  providedIn: 'root'
})
export class GenerateContractService {
  
  constructor(private http: HttpClient){

  }

  getCalendars(date: string): any{
    return this.http.get(`${environment.URL_API}${URL_GENERATE_CONTRACT}/?date=${date}`)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  generateContract(item): any{
    var calendar = {
      calendarId: item
    };

    return this.http.post(`${environment.URL_API}${URL_GENERATE_CONTRACT}`,calendar)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  downloadContract(id) {
    return this.http.get(`${environment.URL_API}${URL_GENERATE_CONTRACT}/download-contract?id=${id}`, { responseType: 'blob' });
  }

  digitalSignature(id) {
    return this.http.get(`${environment.URL_API}${URL_DIGITAL_SIGNATURE}/?calendarId=${id}`)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  history(id){
    return this.http.get(`${environment.URL_API}${URL_DIGITAL_SIGNATURE}/historico?calendarId=${id}`)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }
}
