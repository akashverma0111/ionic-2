import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { Events, AlertController, LoadingController, NavController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.page.html',
    styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
    loginForm: FormGroup;
    errorMsg: any;
    loading: any;
    password: any;
    show: any = 'show';
    category: any;
    constructor(public events: Events, public allServicesService: AllServicesService, public loadingCtrl: LoadingController, public router: Router,
        public alertCtrl: AlertController, public storage: Storage, public menu: MenuController) { }


    ngOnInit() {
        this.category = 'login';
        this.loginForm = new FormGroup({
            'username': new FormControl('', Validators.compose([
                Validators.minLength(5),
                Validators.required,
                //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
                //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            'password': new FormControl('', Validators.compose([
                Validators.minLength(5),
                Validators.required
            ])),
            'jw_auth_sec': new FormControl('wivxCNm$<(+WFwivxCNm$<(+WF#7}1]TWMUl7OaU*TxS(r*$#7}1]wivxCNm$<(+WF#7}1]TWMUl7OaU*TxS(r*$TWMUl7OaU*TxS(r*$', Validators.compose([
                Validators.required
            ])),
        });
    }
    doLogin(loginData) {
        this.showLoader();
        this.allServicesService.doLogin('token', loginData).subscribe(data => {
            this.dismissLoading();
            let rs: any = [];
            rs = data;
            console.log(" SUBSCRIBE  == ", rs);
            if (rs.status = 'ok') {
                this.storage.set('user', rs);
                this.storage.set('user_profile', rs);
                this.events.publish('userCheck:created', rs);
                this.allServicesService.SaveAutoConfiqure(rs.token);
                this.loginForm.reset();


                if (rs.role == 'barber') {
                    if (rs.completed_step == '' || rs.completed_step == null || rs.completed_step == 'basic_info') {
                        this.router.navigate(['/car-info']);
                    } else if (rs.completed_step == 'vehicle_info') {
                        this.router.navigate(['/document-info']);
                    } else if (rs.completed_step == 'document_info') {
                        this.router.navigate(['/background-check-edit']);
                    } else if (rs.completed_step == 'background_check') {
                        this.router.navigate(['/background-check-ques']);
                    } else if (rs.completed_step == 'background_check_ques') {
                        this.router.navigate(['/profile-popup']);
                    } else {
                        this.router.navigate(['/tabs/shop']);
                    }
                } else {
                    this.router.navigate(["/tabs/home-user"]);
                }



                // if(rs.role=="barber"){
                //   this.router.navigate(['/tabs/shop']);
                // }else{
                //   this.router.navigate(['/tabs/home-user']);
                // }

            }
        }, (err) => {
            this.dismissLoading();
            console.log(err);
            console.log("Error = ", err.error);

            if (err.error.code == "[jwt_auth] pending_approval") {
                this.errorMsg = 'ERROR: Your account is still pending approval.';
            } else if(err.error.code == "[jwt_auth] denied_access"){
                this.errorMsg = 'ERROR: Your account has been denied access to this app.';
            }else {
                this.errorMsg = 'User name or password invalid';
            }

        });
    }
    
    ionViewWillEnter() {
        this.menu.enable(false);
        this.menu.swipeEnable(false);
    }

    ionViewDidLeave() {
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

    segmentChanged(event) {
        this.category = event;
    }
    //   hideShowPassword() {
    //     this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    //     this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    // }
}
