import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {AllServicesService} from '../all-services.service';
import { Events,AlertController, LoadingController, NavController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-signin-signup',
  templateUrl: './signin-signup.page.html',
  styleUrls: ['./signin-signup.page.scss'],
})
export class SigninSignupPage implements OnInit {
  loginForm: FormGroup;
  errorMsg:any;
  loading: any; 
  password:any;
  show:any='show';
  category: any;
  constructor( public events: Events,public allServicesService:AllServicesService,public loadingCtrl: LoadingController,public router: Router,
    public alertCtrl:AlertController,public storage:Storage,public menu:MenuController) { }

  ngOnInit() {
    this.category = 'login';
    this.loginForm = new FormGroup({
      'username': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      'jw_auth_sec':new FormControl('wivxCNm$<(+WFwivxCNm$<(+WF#7}1]TWMUl7OaU*TxS(r*$#7}1]wivxCNm$<(+WF#7}1]TWMUl7OaU*TxS(r*$TWMUl7OaU*TxS(r*$', Validators.compose([
        Validators.required
      ])),
    });
  }
  doLogin(loginData){
     this.showLoader();
    this.allServicesService.doLogin('token',loginData).subscribe(data=>{
      this.dismissLoading();
      let rs:any=[];
      rs =data;
      console.log(" SUBSCRIBE  == ",rs);
       if(rs.status='ok'){
        this.storage.set('user', rs);
        this.storage.set('user_profile', rs);
        
        this.events.publish('userCheck:created',rs);
        this.allServicesService.SaveAutoConfiqure(rs.token);
        this.loginForm.reset();
        this.router.navigate(['/tabs']);
       }
    },(err)=>{
      this.dismissLoading();
      console.log(err);
      console.log("Error = ",err.error);
      this.errorMsg = 'User name or password invalid';
    })
  }
  ionViewWillEnter(){
    this.menu.enable(false);
    this.menu.swipeEnable(false);

  }
  ionViewDidLeave(){
    this.menu.enable(true);
  }

  async showLoader(){
    this.loading = await this.loadingCtrl.create({
    message: 'Please wait...',
    backdropDismiss: true,
    
    });
    this.loading.present();
    await this.loading.onDidDismiss();
    }
    async dismissLoading() {
    console.log(this.loading);
    await this.loading.dismiss();
    }
    segmentChanged(event) {
      this.category = event;
    }
  }
 
