import { Component, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { DataService } from 'src/app/services/data.service';
import { ApiService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css']
})
export class LocationMapComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  lon = 18.5793;
  lat = 73.8143;

  headers = {     //Token for API Authorization
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
  }

  constructor(private data : DataService, private api : ApiService, private token : TokenService, private notify :SnotifyService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(data =>  {
      console.log(data);
      if(data){
        this.api.get('location/'+data , this.headers).subscribe(
          data => {
            this.lon = data['latitude'];
            this.lat = data['longitude'];
            var mapProp = {
              center: new google.maps.LatLng(this.lon, this.lat),
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
            };
            this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

            this.updateMap(this.map, mapProp);
          },
          error => { this.notify.error(error.message) }
        );
      }
    });
  }

  updateMap(map, mapProp){
    this.data.currentMessage.subscribe(data =>  {
      if(data){
        this.api.get('location/'+data , this.headers).subscribe(
          data => {
            console.log(data);
            mapProp.center = new google.maps.LatLng(this.lon, this.lat);
            if(this.lon != data['latitude'] || this.lat != data['longitude']){
              this.ngOnInit();
            }
            this.lon = data['latitude'];
            this.lat = data['longitude'];
            var marker = new google.maps.Marker({
              position: mapProp.center,
              title: "Last Seen At " + data['timestamp']
            });
            marker.setMap(this.map);

            setTimeout(() =>
            {
              this.updateMap(map, mapProp);
            },
            10000)
          },
          error => { this.notify.error(error.message) }
        );
      }
    });
  }

}
