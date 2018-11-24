import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-signup-confrim',
  templateUrl: './signup-confrim.component.html',
  styleUrls: ['./signup-confrim.component.css']
})
export class SignupConfrimComponent implements OnInit {

  'token' =  null;

  constructor(private notify : SnotifyService, private router : Router, private route : ActivatedRoute, private api : ApiService) {
    route.queryParams.subscribe(params => {
      this.token = params['token'];
    })
  }

  ngOnInit() {
    this.notify.clear();
    if(this.token){
      this.notify.info("Wait...", {timeout:0});
      this.api.get("auth/signup/activate/"+this.token, null).subscribe(
        data => { this.notify.clear(); this.notify.info("Account Activated", {timeout:2000}); this.router.navigateByUrl("/login"); },
        error => { this.notify.clear(); this.notify.error(error.error.message) }
      );
    }
  }

  onSubmit(){
    this.ngOnInit();
  }

}
