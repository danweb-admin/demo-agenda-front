import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { routes } from 'src/app/consts';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent implements OnInit {

  isDriver: boolean = false;
  public routers: typeof routes = routes;

  constructor(private userService: UserService,
              private router: Router) { 
                this.isDriver = this.userService.isDriver();
    
  }
  ngOnInit(): void {
    if (this.isDriver){
      this.router.navigate([this.routers.CALENDAR_CONSUMABLE]).then();    
    }
  }

}
