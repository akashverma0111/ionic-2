import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  user: any;
  res: any;
  barberReady: boolean = false;
  service_id: any = 0;
  q: any;
  serviceReady: boolean = false;
  searchQuery: any = '';  
  list: any;
  resService: any;
  locateclass: any = 'locate';
  page:number=1;
  latitude: any = '';
  longitude: any = '';
  filter_day: any = 'all';
  filter_time: any = '';

  userlist = [];

  location_filter: boolean = false;
  constructor(public allServicesService: AllServicesService,
    public loadingCtrl: LoadingController,
    public router: Router,
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private geolocation: Geolocation,
    public storage: Storage) {
    this.service_id = this.route.snapshot.parent.paramMap.get('service_id');
    this.searchQuery = this.route.snapshot.parent.paramMap.get('q');
    if (!this.searchQuery) {
      this.searchQuery = '';
    }

    this.storage.get('user').then(userInfo => {
      if (userInfo != null) {
        this.user = userInfo;
      }
    });
    this.GetServices();
    this.GetUsers();
  }

  ngOnInit() {
  }

  GetLocation() {
    if (this.location_filter == true) {
      this.location_filter = false;
      this.locateclass = "locateRed";
    } else {
      this.location_filter = true;
      this.locateclass = "locate";
    }

    if (this.location_filter) {
      this.geolocation.getCurrentPosition().then((resp) => {
        console.log(resp);
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        this.GetUsers();

      }).catch((error) => {
        this.GetUsers();
      });
    } else {
      this.latitude = '';
      this.longitude = '';
      this.GetUsers();
    }

  }

  GetServices() {

    this.allServicesService.getData('getServices').subscribe(data => {
      this.resService = data;
      if (this.resService.status = 'ok') {
        this.serviceReady = true;
        this.list = this.resService.list;
      }
    }, (err) => {
      this.serviceReady = true;
      this.allServicesService.presentAlert("Something went wrong, please inform app admin.");
    })
  }

  GetUsers() {
    this.barberReady = false;
    this.userlist = [];
    this.page=1;
    this.allServicesService.getData('get_user_role_wise/?role=barber&service_id=' + this.service_id + '&q=' + this.searchQuery + '&latitude=' + this.latitude + '&longitude=' + this.longitude + '&filter_day=' + this.filter_day + '&filter_time=' + this.filter_time+'&page_no='+this.page).subscribe(data => {
      this.res = data;
      if (this.res.status = 'ok') {
        this.barberReady = true;
        this.userlist = this.res.list;
        console.log(this.userlist);
      }
    }, (err) => {
      this.barberReady = true;
      this.allServicesService.presentAlert("Something went wrong, please inform app admin.");
    })
  }


  loadMore(event) {
    this.page++;
    this.allServicesService.getData('get_user_role_wise/?role=barber&service_id=' + this.service_id + '&q=' + this.searchQuery + '&latitude=' + this.latitude + '&longitude=' + this.longitude + '&filter_day=' + this.filter_day + '&filter_time=' + this.filter_time+'&page_no='+this.page).subscribe(data => {
      this.res = data;
      if (this.res.status = 'ok') {
        //this.userlist = this.res.list;
        this.userlist = [...this.userlist, ...this.res.list];
        if(this.res.list.length==0){
          this.page--;
        }
        event.target.complete();
      }
    }, (err) => {
      this.page--;
      event.target.complete();
    })
  }

  submitSearch(e) {
    if (typeof this.searchQuery != "undefined") {
      if (this.filter_day == "all") {
        this.filter_time = '';
      }
      setTimeout(
        (z) => {
          this.GetUsers();
        }, 200);
    }
  }

  clearSearch(e) {

    this.searchQuery = '';
    if (typeof this.searchQuery != "undefined") {
      setTimeout(
        (z) => {
          this.GetUsers();
        }, 200);

    }
  }

}
