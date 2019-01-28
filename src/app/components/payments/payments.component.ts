import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SnotifyService } from 'ng-snotify';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from '../../services/token.service'
import { DataService } from 'src/app/services/data.service';
import { RolesCheckService } from 'src/app/services/roles-check.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  payments = null;

  isAdmin = false;
  isTeacher = false;
  isStudent = false;
  isParent = false;
  isStudentorParent = false;

  headers = {     //Token for API Authorization
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
  }

  constructor(private http : HttpClient, private role : RolesCheckService, private route : ActivatedRoute, private data: DataService , private token : TokenService, private router : Router,private api : ApiService, private notify : SnotifyService) {
  }

  ngOnInit() {
    this.notify.clear();
    this.notify.info("Loading...", {timeout: 0});
    this.isAdmin = this.role.isAdmin || this.role.isSuperAdmin;
    this.isTeacher = this.role.isTeacher;
    this.isStudent = this.role.isStudent;
    this.isParent = this.role.isParent;

    this.route.queryParams.subscribe(params => {
      if(this.isParent || this.isStudent){
        this.isStudentorParent = true;
        this.api.get('payments/history?student_id=' + localStorage.getItem('student_id'), this.headers).subscribe(
          data => this.datahandler(data),
          error => { this.token.remove(); this.router.navigateByUrl("/login"); }
        );
        this.api.get('payments/pay?student_id=' + localStorage.getItem('student_id'), this.headers).subscribe(
          data => this.datahandlerPay(data),
          error => { this.token.remove(); this.router.navigateByUrl("/login"); }
        );
      } else {
        this.notify.clear();
      }
    });
  }

  datahandler(data){
    this.notify.clear();
    console.log(data);
    this.payments = data;
  }

  payhere = null;
  datahandlerPay(data){
    this.notify.clear();
    console.log(data);
    this.payhere = data;
    this.payHereData = {
      'merchant_id' : this.payhere.Merchant_id,
      'return_url' : this.payhere.return_url,
      'cancel_url' : this.payhere.cancel_url,
      'notify_url' : this.payhere.notify_url,
      'first_name' : 'EMS',
      'last_name' : this.payhere.student.user.name,
      'email' : this.payhere.student.user.email,
      'phone' : '0000000000',
      'address' : this.payhere.student.user.address,
      'city' : "Colombo",
      'country' : "Sri Lanka",
      'order_id' : this.payhere.order_id,
      'items' : this.payhere.student.package.name,
      'currency' : 'LKR',
      'amount' : this.payhere.student.package.price
    }
  }

  payHereData = {
    'merchant_id' : null,
    'return_url' : null,
    'cancel_url' : null,
    'notify_url' : null,
    'first_name' : 'EMS',
    'last_name' : null,
    'email' : null,
    'phone' : '0000000000',
    'address' : null,
    'city' : "Colombo",
    'country' : "Sri Lanka",
    'order_id' : null,
    'items' : null,
    'currency' : 'LKR',
    'amount' : null,
  }

  payNow(){
    let payHereData = {
      'merchant_id' : this.payhere.merchant_id,
      'return_url' : this.payhere.return_url,
      'cancel_url' : this.payhere.cancel_url,
      'notify_url' : this.payhere.notify_url,
      'first_name' : 'EMS',
      'last_name' : this.payhere.student.user.name,
      'email' : this.payhere.student.user.email,
      'phone' : '0000000000',
      'address' : this.payhere.student.user.address,
      'city' : "Colombo",
      'country' : "Sri Lanka",
      'order_id' : this.payhere.order_id,
      'items' : this.payhere.student.package.name,
      'currency' : 'LKR',
      'amount' : this.payhere.student.package.price,
    }
    console.log(payHereData);
    var header = {'Content' : 'Typeapplication/x-www-form-urlencoded'};
    this.http.post('https://sandbox.payhere.lk/pay/checkout', payHereData, { headers: new HttpHeaders(header) }).subscribe(
    );

  }

}
