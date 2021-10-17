import { Component, OnInit } from '@angular/core';
import { AllServicesService } from '../all-services.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  setting:any;
  about:any;
  readyposts:boolean=false;
  constructor(public serviceForAllService: AllServicesService,) { }

  ngOnInit() {
    this.GetSetting();
  }

  GetSetting(){
    this.serviceForAllService.GetSetting()
    .subscribe(res => {
      this.readyposts=true;
      this.setting=res;
      this.about=this.setting.about.about_text;
      this.serviceForAllService.setSetting({
        secret_key:  this.setting.secret_key,
        publishable_key: this.setting.publishable_key,
        about:this.setting.about
      });

    })
  }

}
