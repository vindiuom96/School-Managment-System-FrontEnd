import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user = {
    'name' : null,
    'email' : null,
    'img' : null
  };

  constructor(
    private users : UserService
  ) { }

  ngOnInit() {
    this.user = this.users.user();
  }

}
