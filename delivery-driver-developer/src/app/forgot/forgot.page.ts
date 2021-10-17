import { Component, OnInit } from '@angular/core';
import {AllServicesService} from '../all-services.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertController, LoadingController, NavController, MenuController,ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { CheckMailPage } from '../check-mail/check-mail.page';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {

  forgot_form: FormGroup;
  loading:any;
  constructor(public allServicesService:AllServicesService,public router:Router,public menu:MenuController,public toastController:ToastController,public loadingCtrl:LoadingController,public modalController: ModalController) { }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CheckMailPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
  
  ngOnInit() {
    this.forgot_form = new FormGroup({
      'user_login': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }
  forgotpassword(forgot){
    console.log("SignUp Data == ",forgot);
     this.showLoader();
    this.allServicesService.sendData('retrieve_password',forgot).subscribe(data=>{
      let rs:any=[];
      rs =data;
      this.dismissLoading();
       if(rs.status='ok'){
        this.presentToast(rs.msg);
        this.router.navigate(['/signin']);
       }
    },err=>{
      console.log("Error = ",err);
      this.dismissLoading();
      this.presentToast(err.error.msg);
    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
      position:'bottom'
    });
  
    toast.present();
  }

  ionViewWillEnter(){
    this.menu.enable(false);
    this.menu.swipeEnable(false);
  }
  ionViewDidLeave(){
    this.menu.enable(true);
  }
  async showLoader() {
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

}

