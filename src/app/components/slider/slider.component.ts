import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  loggedIn : boolean;
  constructor(private auth : AuthService) { }

  ngOnInit() {
    this.auth.authStatus.subscribe(
      value => this.loggedIn = value
    );
    console.log("slider: " + this.loggedIn);
  }

}
