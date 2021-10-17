import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AllServicesService } from '../all-services.service';
import { Storage } from '@ionic/storage';
import { ModalController, MenuController, LoadingController,AlertController,ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PasswordValidator } from '../validators/password.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

    changePassForm:FormGroup;
    errorMsg:any;
    changePasswordData:any=[];
    token:any;
    check:any=[];
    loading:any;
    user:any =[];
    matching_passwords_group: FormGroup;
  
    validation_messages = {
      'oldPassword': [
        { type: 'required', message: 'Old password is required.' },
        { type: 'minlength', message: 'Old password must be at least 5 characters long.' }
      ],
      'password': [
        { type: 'required', message: 'Password is required.' },
        { type: 'minlength', message: 'Password must be at least 5 characters long.' }
      ],
      'confirmPassword': [
        { type: 'required', message: 'Confirm password is required.' },
      ],
      'matching_passwords': [
        { type: 'areNotEqual', message: 'Password mismatch' }
      ]
    };

  constructor(
    public serviceForAllService:AllServicesService,
    public storage:Storage,
    public modalController: ModalController,
    public menu: MenuController,
    public loadingController:LoadingController,
    public router:Router,
    public alertCtrl: AlertController,
    public toastController:ToastController
  ) {
    this.storage.get('user').then(user =>{
        this.user=user;
        console.log("USER DETAILs  ==== ",user);
      });
   }

  ngOnInit() {
    this.matching_passwords_group = new FormGroup({
        'password': new FormControl('', Validators.compose([
          Validators.minLength(5),
          Validators.required
        ])),
        'confirmPassword': new FormControl('', Validators.required)
      }, (formGroup: FormGroup) => {
        return PasswordValidator.areNotEqual(formGroup);
      });
  
      this.changePassForm = new FormGroup({
        'oldPassword': new FormControl('', Validators.compose([
          Validators.required,Validators.minLength(5)
        ])),
        'matching_passwords': this.matching_passwords_group,
      
      });
  }

  
  async changePassword(formValue) {
    // this.presentLoading();
    if (formValue.matching_passwords.password === formValue.matching_passwords.confirmPassword) {
      console.log("FORM VALUE ====== ", formValue);
      this.errorMsg= "";
      if(this.user.token) {
        this.changePasswordData = {
          token: this.user.token,
          oldPassword: formValue.oldPassword,
          password: formValue.matching_passwords.confirmPassword
        }

        this.presentLoading();
        this.serviceForAllService.sendData('change_password', this.changePasswordData).subscribe(data => {
          console.log("CHANGE PASSWORD RES", data);
          console.log("loader dismiss");
          this.loading.dismiss();
          this.check= data;
          if(this.check.success == 'succeed'){
           console.log(this.check.success_msg);
           this.presentToast(this.check.success_msg, ['/tabs/profile']);

          }else if(this.check.error_msg){ 
            console.log(this.check.error_msg);
            this.errorMsg= this.check.error_msg;
            this.presentToast(this.errorMsg, '');
          }

        }, err => {
        
          console.log("error ====", err);
        })
      }else{
        this.presentToast("User token expired. Please try again", ['/signin']);
      }

    } else {
     
      this.errorMsg = "Password and confirm password are not matched ";
    }

  }

  async presentToast(msg, page) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position:'bottom'
    });
    toast.present().then(
      x=>{ 
        console.log("Inside");
       this.router.navigate(page);
      }
     );
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({message: 'Please wait...',cssClass:'custom-load'});
    this.loading.present();
  }


}
