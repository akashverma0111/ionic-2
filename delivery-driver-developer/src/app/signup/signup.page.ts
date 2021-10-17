import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AllServicesService } from '../all-services.service';
import { Events, AlertController, LoadingController, NavController, MenuController, ToastController } from '@ionic/angular';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
    signupForm: FormGroup;
    loading: any;
    type: any;
    biffclass: any = 'biff';
    griffclass: any;
    bufordclass: any;
    role: any = "";

	validation_messages = {
		userName: [{ type: "required", message: "Full Name is required." }],
		// first_name: [{ type: "required", message: "First Name is required." }],
		// last_name: [{ type: "required", message: "Last Name is required." }],
		email: [
			{ type: "required", message: "Email is required." },
			{ type: "pattern", message: "Enter a valid email." }
		],
		password: [
			{ type: "required", message: "Password is required." },
			{
				type: "minlength",
				message: "Password must be 5 characters."
			}
		],
		phone: [
			{ type: "required", message: "Phone is required." },
		],
		term_conditions: [
			{ type: 'required', message: 'Terms & Condition is required.' }
		],
		role: [
			{ type: "required", message: "User type is required." },
		],
		address: [
			{ type: "required", message: "Address is required." },
		],
		city: [
			{ type: "required", message: "City is required." },
		],
		state: [
			{ type: "required", message: "State is required." },
		],
		zipcode: [
			{ type: "required", message: "Zipcode is required." },
		]
    };
    
    constructor(
        public allServicesService: AllServicesService,
        public loadingCtrl: LoadingController,
        public router: Router,
        public alertCtrl: AlertController,
        public menu: MenuController,
        public actionSheetController: ActionSheetController,
        public toastController: ToastController,
        public storage: Storage,
        private route: ActivatedRoute,
        public events: Events
    ) {
        this.griffclass = 'biff';
        this.biffclass = '';
        this.route.queryParams.subscribe(params => {
            if (params) {
                console.log(params);
                this.role = params.role;
            }
        });
    }

    ngOnInit() {

        this.signupForm = new FormGroup({
            'userName': new FormControl("", Validators.compose([
                Validators.required
            ])),
            'business_name': new FormControl(""),
            'business_type': new FormControl(""),
            'email': new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            'password': new FormControl("", Validators.compose([
                Validators.required
            ])),
            'phone': new FormControl("", Validators.compose([
                Validators.required
            ])),
            "address": new FormControl("", Validators.compose([
                Validators.required
            ])),
            "address1": new FormControl(""),
            "city": new FormControl("", Validators.compose([
                Validators.required
            ])),
            "state": new FormControl("", Validators.compose([
                Validators.required
            ])),
            "zipcode": new FormControl("", Validators.compose([
                Validators.required
            ])),
            "notes": new FormControl(""),
            "term_conditions": new FormControl("", Validators.compose([
                Validators.required
            ])),
            "role": new FormControl(this.role, Validators.compose([
                Validators.required
            ]))
        });

    }
    // radioChecked(event) {
    //     console.log(event);
    //     if (event.detail.value == "barber") {
    //         this.role = "barber";
    //         this.biffclass = 'biff'
    //         this.griffclass = '';
    //     }
    //     if (event.detail.value == "customer") {
    //         this.role = "customer";
    //         this.griffclass = 'biff';
    //         this.biffclass = '';
    //     }
    //     console.log(this.role);
    // }

    doSignup(signUpData) {

        console.log(signUpData);
        this.showLoader();
        console.log("SignUp Data == ", signUpData);
        signUpData.jw_auth_sec = "wivxCNm$<(+WFwivxCNm$<(+WF#7}1]TWMUl7OaU*TxS(r*$#7}1]wivxCNm$<(+WF#7}1]TWMUl7OaU*TxS(r*$TWMUl7OaU*TxS(r*$";
        this.allServicesService.sendData('register', signUpData).subscribe(data => {

            let rs: any = [];
            rs = data;
            console.log(" SUBSCRIBE  == ", data);
            this.dismissLoading();
            if (rs.status = 'ok') {
                this.signupForm.reset();
                this.presentAlert("User Register Successfully!");

                // if(this.role=='customer'){
                //     this.router.navigate(['/signupsuccess']);
                // }else{
                //     this.router.navigate(['/car-info']);
                // }

                if (this.role == "barber") {
                    //car-info
                    let logindata = {
                        username: signUpData.email,
                        password: signUpData.password
                    }
                    this.doLogin(logindata);

                } else {
                    this.router.navigate(["/signin"]);
                }

            }
        }, err => {
            // this.loading.dissmiss();
            this.dismissLoading();
            console.log("Error = ", err);
            this.presentToast(err.error.errormsg);
        })
    }


    doLogin(loginData) {
        this.showLoader();
        this.allServicesService.doLogin('token', loginData).subscribe(data => {

            let rs: any = [];
            rs = data;
            console.log(" SUBSCRIBE  == ", rs);
            if (rs.status = 'ok') {
                this.dismissLoading();
                this.storage.set('user', rs);
                this.storage.set('user_profile', rs);
                this.events.publish('userCheck:created', rs);
                this.allServicesService.SaveAutoConfiqure(rs.token);
                // this.router.navigate(["/car-info/" + rs.user_id]);
                this.router.navigate(['/car-info']);
            }
        }, (err) => {
            this.dismissLoading();
            console.log(err);
            console.log("Error = ", err.error);
        })
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

    async presentAlert(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    }

    get_role(){
        console.log("role is: " + this.role);
		if (this.role == 'customer') {
            this.signupForm.addControl('business_name', new FormControl(''));
            this.signupForm.addControl('business_type', new FormControl(''));
		} else {
            this.signupForm.removeControl('business_name');
            this.signupForm.removeControl('business_type');
		}
    }
}
