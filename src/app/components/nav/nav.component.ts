import { Component, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private notify : SnotifyService) {
   }

  ngOnInit() {
  }

  logout(Event = MouseEvent){
    event.preventDefault;
    this.notify.info("Logout Succesfully", {timeout:2000});
  }

}
