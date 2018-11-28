import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private token : TokenService, private router : Router) {
    if(token.loggedIn){
        router.navigateByUrl("/dashboard");
    }
  }

  ngOnInit() {
  }

}
