import { Component, OnInit } from '@angular/core';
import { debug } from 'console';
import { SpinnerService } from './shared/services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  ngOnInit(): void {
    this.getExternalIP();
  }
  
  
  async getExternalIP(): Promise<void> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      console.log('IP externo:', data.ip);
    } catch (error) {
      console.error('Erro ao obter IP:', error);
    }
  }
}
