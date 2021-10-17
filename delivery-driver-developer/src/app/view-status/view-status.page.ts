import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { AlertController, LoadingController, NavController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;
@Component({
  selector: 'app-view-status',
  templateUrl: './view-status.page.html',
  styleUrls: ['./view-status.page.scss'],
})
export class ViewStatusPage implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  mapView: boolean = false;
  directionsDisplay = new google.maps.DirectionsRenderer;
  user: any;
  res: any;
  serviceReady: boolean = false;
  list: any;
  barberReady: any;
  barberlist: any;
  barberlist_map:any;
  marker: any = [];
  latitude: any = 35.962639;
  longitude: any = -83.916718;

  searchQuery: any;
  category: any;
  constructor(
    public allServicesService: AllServicesService,
    public loadingCtrl: LoadingController,
    public router: Router,
    public route: ActivatedRoute,
    public navCtrl: NavController,
    private menu :MenuController,
    private geolocation: Geolocation,
    public alertCtrl: AlertController,
    public storage: Storage
  ) {

    this.storage.get('user').then(userInfo => {
      if (userInfo != null) {
        this.user = userInfo;
        this.allServicesService.SaveAutoConfiqure(this.user.token);
      }else{
        
      }
    },err=>{

    });
    this.GetServices();
    
    setTimeout(
      (z) => {
        this.GetLocation();
      }, 1000);
  }

  ionViewDidLoad() {


  }

  ionViewWillEnter(){
    this.menu.enable(true);
    this.storage.get('user').then(userInfo => {
      if (userInfo != null) {
        this.user = userInfo;
        this.allServicesService.SaveAutoConfiqure(this.user.token);
      }
    });
  }

  GetLocation() {
    this.initMap();
    this.geolocation.getCurrentPosition().then((resp) => {
    
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
      this.GetUsers(this.latitude, this.longitude);
    }).catch((error) => {
      this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
      // this.GetUsers('', '');
    });
  }

  ngOnInit() {
    // this.GetLocation();
    this.category = 'map';
  }

  async GetServices() {
    this.allServicesService.getData('getServices').subscribe(data => {
      this.res = data;
      if (this.res.status = 'ok') {
        this.serviceReady = true;
        this.list = this.res.list;
      }
    }, (err) => {
      this.serviceReady = true;
      this.allServicesService.presentAlert("Something went wrong, please inform app admin.");
    })
  }

  submitSearch($event) {
    if (typeof this.searchQuery != "undefined") {
      setTimeout(
        (z) => {
          this.navCtrl.navigateForward(['/shop_search/' + this.searchQuery]);
        }, 200);
    }
  }

  clearSearch(e) {
    this.searchQuery = '';
 
  }

  async GetUsers(latitude, longitude) {
    this.marker = [];
    this.allServicesService.getData('get_user_role_wise/?type=home&role=barber&latitude=' + latitude + '&longitude=' + longitude).subscribe(data => {
      this.res = data;
      if (this.res.status = 'ok') {
        this.barberReady = true;
        this.barberlist = this.res.list;
        this.barberlist.forEach(element => {

          console.log("ELEMENT ===== ",element);
          if (element.map_lat!=''  && element.map_lng !='') {
            const icon = {
              url: '/assets/imgs/marker.png', // image url
              scaledSize: new google.maps.Size(50, 50), // scaled size
            };

            let marker= new google.maps.Marker({
              position: {
                lat: element.map_lat,
                lng: element.map_lng,
              },
              map: this.map,
              title: element.shop_name,
              icon: icon,
              id: element.id,
            });

        let title = element.shop_name;
        let image = element.shop_logo;
        let price = element.amount_range;
        let pid = element.id;
        
        // google.maps.event.addListener(marker, 'click', function () {
        //   infowindow.setContent('<div  id=' + 'propertyInfo' + ' class=' + 'mapDiv' + '>' + '<h6>' + title + '</h6>' + '<p class=' + 'price' + '>' + price + '</p>' +
        //     '<img class=' + 'mapImg' + ' src="' + image + '" id=' + pid + ' >'
        //     + '</div>');
        //   infowindow.open(this.map, this);
        // })
        // this.directionsDisplay.setMap(this.map);



        google.maps.event.addListener(marker, 'click',  ()=> {
          var contentString = '<div class="textData"></div>';
                var infowindow = new google.maps.InfoWindow({
                  content: contentString,
                  closeBoxURL: "",
                  disableAutoPan: true
                });
                let div = document.createElement('div');
                var img = document.createElement("img");
                div.innerHTML='<div   id=' + 'propertyInfo' + ' class=' + 'mapDiv' + '>' + '<h6>' + title + '</h6>' + '<p class=' + 'price' + '>' + price + '</p>' +
                '<img class=' + 'mapImg' + ' src="' + image + '" id=' + pid + ' >'
                + '</div>'
                              
                div.onclick = () => { this.gotosingles(pid) };
                infowindow.setContent(div);
                img.setAttribute('class', 'img_marker');
                img.src = image;
                div.appendChild(img);
                var infowindow = new google.maps.InfoWindow();
                var service = google.maps.places.PlacesService(this.map);
                infowindow.open(this.map, marker);
        })
        this.directionsDisplay.setMap(this.map);
          }
        });

      }
    }, (err) => {
      this.barberReady = true;
      this.allServicesService.presentAlert("Something went wrong, please inform app admin.");
    })
  }

  async initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      center: {
        lat: this.latitude,
        lng: this.longitude
      }
    });  
    this.directionsDisplay.setMap(this.map);
    google.maps.event.addListener(this.map, 'idle', ()=> {
      this.latitude=this.map.getBounds().getCenter().lat();
      this.longitude=this.map.getBounds().getCenter().lng();
      this.GetUsersMap(this.latitude,this.longitude);

    });
  }
  
  async GetUsersMap(latitude, longitude) {
    //this.marker = [];
    this.allServicesService.getData('get_user_role_wise/?type=home_map&role=barber&latitude=' + latitude + '&longitude=' + longitude).subscribe(data => {
      this.res = data;
      if (this.res.status = 'ok') {
        this.barberReady = true;
        this.barberlist_map = this.res.list;

        console.log("BARBER LIST ===== ",this.barberlist_map);
        this.barberlist_map.forEach(element =>{

          console.log("ELEMENT ===== ",element);
          if (element.map_lat!=''  && element.map_lng !='') {
            const icon = {
              url: '/assets/imgs/marker.png', // image url
              scaledSize: new google.maps.Size(50, 50), // scaled size
            };
      
            let marker= new google.maps.Marker({
              position: {
                lat: element.map_lat,
                lng: element.map_lng,
              },
              map: this.map,
              title: element.shop_name,
              icon: icon,
              id: element.id,
            });
      
        let title = element.shop_name;
        let image = element.shop_logo;
        let price = element.amount_range;
        let pid = element.id;
      
        var infowindow = new google.maps.InfoWindow();
        var service = google.maps.places.PlacesService(this.map);
        google.maps.event.addListener(marker, 'click',  ()=> {
          var contentString = '<div class="textData"></div>';
                var infowindow = new google.maps.InfoWindow({
                  content: contentString,
                  closeBoxURL: "",
                  disableAutoPan: true
                });
                let div = document.createElement('div');
                var img = document.createElement("img");
        let price = element.amount_range;
                div.innerHTML='<div   id=' + 'propertyInfo' + ' class=' + 'mapDiv' + '>' + '<h6>' + title + '</h6>' + '<p class=' + 'price' + '>' + price + '</p>' +
                '<img class=' + 'mapImg' + ' src="' + image + ' >'
                + '</div>'
                           
                img.setAttribute('class', 'img_marker');
                img.src = image;
                div.appendChild(img);
                div.onclick = () => { this.gotosingles(pid) };
                infowindow.setContent(div);
                infowindow.open(this.map, marker);
        })
        this.directionsDisplay.setMap(this.map);
      
          }
        });
      
      }
    }, (err) => {
      this.barberReady = true;
      this.allServicesService.presentAlert("Something went wrong, please inform app admin.");
    })
  }

  gotosingles(id){
    console.log("ID ======= "+id);

      this.router.navigate(['barberprofile',{
        id:id
      }]);
  }


  doSomething(ev: any) {

    console.log("EVENT ====== ",ev);
    console.log("innerHTML = ",ev.target.innerHTML);
console.log("EVENT ====== ",ev.target.textContent);

  }


OpenModal(marker){
   console.log(marker);
}


}
