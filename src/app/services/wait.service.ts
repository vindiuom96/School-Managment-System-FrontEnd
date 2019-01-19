import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WaitService {

  constructor() { }

  ms(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
  }
}
