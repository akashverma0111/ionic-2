import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Events, AlertController, Platform, MenuController,ModalController } from '@ionic/angular';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';
import { GalleryCustomModalPage } from '../gallery-custom-modal/gallery-custom-modal.page';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss'],
})
export class UserprofilePage implements OnInit {
  userDetails: any = [];
  type: any;
  user_id: any;
  user: any;
  is_private: boolean = false;
  ready: boolean = false;
  user_info: any;
  res: any;
  res_gallery: any;
  gallery: any=[];
  constructor(public storage: Storage,
    private callNumber: CallNumber,
    public menuCtrl: MenuController,
    private route: ActivatedRoute,
    public location: Location,
    public modalController: ModalController,
    public allServicesService: AllServicesService,
    public alertCtrl: AlertController) {

    this.type = this.route.snapshot.parent.paramMap.get('type');
    this.user_id = this.route.snapshot.parent.paramMap.get('user_id');
    this.storage.get('user').then(userInfo => {
      if (userInfo != null) {
        this.user = userInfo;
        this.allServicesService.SaveAutoConfiqure(this.user.token);
      }
    }, err => {

    });
  }
  slideOptsmulti = {
    loop: false,
    slidesPerView: 3,
    slidesPerGroup: 3,
    grabCursor: true,
    spaceBetween: 10
  };
  ionViewWillEnter() {

    if (this.type == "private") {
      this.is_private = true;
      this.RenderProfileData();

    } else {
      this.is_private = false;
      this.GetUserProfile(this.user_id);
    }

  }

  ngOnInit() {
  }

  call(num) {
    console.log("Number  == " + num);
    this.callNumber.callNumber(num, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  RenderProfileData() {

    this.storage.get('user_profile').then(user_profile => {
      if (user_profile != null) {
        this.ready = true;
        this.user_info = user_profile;
        console.log(this.user_info);
        this.GetUserProfile(this.user.token);
      }
    }, err => {

    });
  }

  GetUserProfile(user_id) {
    this.allServicesService.getData('getProfile/?token=' + user_id + '&type=' + this.type).subscribe(data => {
      this.res = data;
      if (this.res.status = 'ok') {
        this.ready = true;
        this.user_info = this.res;
        // this.GetUserProfileImages(user_id);
        if (this.type == "private") {
          this.storage.set('user_profile', this.res);
        }
      }
    }, (err) => {
      this.ready = true;
      this.allServicesService.presentAlert(err.error.errormsg);
      if (err.error.error_code == "user_expire") {
        this.location.back();
      }
    })
  }

  GetUserProfileImages(user_id) {
    this.allServicesService.getData('getPhotos/?token=' + user_id + '&type='+this.type).subscribe(data => {
      this.res_gallery = data;
      if (this.res_gallery.status = 'ok') {
        this.gallery = this.res_gallery.images;
      }
    }, (err) => {

      this.allServicesService.presentAlert(err.error.errormsg);
      if (err.error.error_code == "user_expire") {
        //this.location.back();
      }
    })
  }
  async open_gallery_modal(index, gallery) {
    console.log('index', index);
    console.log('gallery', gallery);
    const modal = await this.modalController.create({
      component: GalleryCustomModalPage,
      componentProps: { index: index, gallery: gallery },
      cssClass: 'gallery_modal'
    });
    return await modal.present();
  }
}
