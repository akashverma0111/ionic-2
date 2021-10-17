import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { AllServicesService } from "../all-services.service";
import { AlertController, LoadingController, NavController, MenuController, ToastController, Events, Platform } from "@ionic/angular";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ActionSheetController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-background-check-edit',
  templateUrl: './background-check-edit.page.html',
  styleUrls: ['./background-check-edit.page.scss'],
})
export class BackgroundCheckEditPage implements OnInit {

    backgroundCheckForm: FormGroup;

    user: any = [];
    background_check_info: any = [];
    ready: boolean;

    action: any = '';
    buttonText: any = 'Next';
    ischecked_personal_information_encryption: boolean = false;
    ischecked_doesnt_affect_your_credit: boolean = false;

    validation_messages = {
        'ssn': [
            { type: 'required', message: 'SSN is required' },
        ],
        'birth_date': [
            { type: 'required', message: 'Birth date is required' },
        ],
        'phone': [
            { type: 'required', message: 'Phone is required' },
        ],
        'license': [
            { type: 'required', message: 'License is required' },
        ],
        'licensing_state': [
            { type: 'required', message: 'Licensing_state is required' },
        ],
        'personal_information_encryption': [
            { type: 'required', message: 'This is required' },
        ],
        'doesnt_affect_your_credit': [
            { type: 'required', message: 'This is required' },
        ]
    };

  constructor(
    public allServicesService: AllServicesService,
    public loadingCtrl: LoadingController,
    public router: Router,
    private route: ActivatedRoute,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public toastController: ToastController,
    public storage: Storage,
    public events: Events,
    private ref: ChangeDetectorRef
  ) { 
    this.storage.get('user').then(userInfo => {
        if (userInfo != null) {
            this.user = userInfo;
            if (this.action == 'update') {
                this.get_background_check();
            }
        }
    }, err => {

    });

    this.route.queryParams.subscribe(params => {
        let queryData: any = []
        queryData = params;
        if (queryData.action) {
            this.action = queryData.action;
            this.buttonText = 'Update';
        }
    });

  }

  ngOnInit() {
    this.backgroundCheckForm = new FormGroup({
        ssn: new FormControl("", Validators.compose([Validators.required])),
        birth_date: new FormControl("", Validators.compose([Validators.required])),
        phone: new FormControl("", Validators.compose([Validators.required])),
        license: new FormControl("", Validators.compose([Validators.required])),
        licensing_state: new FormControl("", Validators.compose([Validators.required])),
        personal_information_encryption: new FormControl("", Validators.compose([Validators.required])),
        doesnt_affect_your_credit: new FormControl("", Validators.compose([Validators.required]))
    });
  }

  get_background_check() {
    this.ready = false;
    this.allServicesService.getData('get_background_check/?token=' + this.user.token).subscribe((result) => {
        this.ready = true;
        let res: any = [];
        res = result;
        this.background_check_info = res.background_check_info;
        console.log('this.background_check_info: ', this.background_check_info);

        this.backgroundCheckForm.controls['ssn'].setValue(this.background_check_info.ssn);
        this.backgroundCheckForm.controls['birth_date'].setValue(this.background_check_info.birth_date);
        this.backgroundCheckForm.controls['phone'].setValue(this.background_check_info.phone);
        this.backgroundCheckForm.controls['license'].setValue(this.background_check_info.license);
        this.backgroundCheckForm.controls['licensing_state'].setValue(this.background_check_info.licensing_state);
        if(this.background_check_info.personal_information_encryption == true || this.background_check_info.personal_information_encryption == 1){
            this.backgroundCheckForm.controls['personal_information_encryption'].setValue(this.background_check_info.personal_information_encryption);
            this.ischecked_personal_information_encryption = true;
        }
        if(this.background_check_info.doesnt_affect_your_credit == true || this.background_check_info.doesnt_affect_your_credit == 1){
            this.backgroundCheckForm.controls['doesnt_affect_your_credit'].setValue(this.background_check_info.doesnt_affect_your_credit);
            this.ischecked_doesnt_affect_your_credit = true;
        }

        this.ref.detectChanges();

    }, (err) => {
        this.ready = true;
        console.log("error...", err);
    });
}

saveBackgroundCheckInfo(formValue) {
    this.storage.get('user').then(userInfo => {
        if (userInfo != null) {
            this.user = userInfo;
          
            formValue.token = this.user.token;
            if(this.action == 'update'){
                formValue.action = 'update';
            }else{
                formValue.action = 'add';
            }

            this.allServicesService.showLoader('Please wait...');
            this.allServicesService.sendData('save_background_check', formValue).subscribe(
                result => {
                    let rs: any = [];
                    rs = result;
                    console.log("result here", result);
                    if (rs.status == "ok") {
                        // this.oneSignal.getIds().then((data) => {
                        // 	console.log(data);
                        // 	this.deviceToken = data.userId;
                        // });
                        this.allServicesService.dismissLoading();

                        if (rs.msg != '') {
                            this.allServicesService.presentToast(rs.msg);
                        }

                        this.events.publish('user:save_background_check', this.user);

                        if (this.action == 'update') {
                            this.router.navigate(['/background-check']);
                        } else {
                            this.user.completed_step = 'background_check';
                            this.storage.set('user_profile', this.user);
                            this.storage.set('user', this.user);
                            this.router.navigate(['/background-check-ques']);
                        }
                    }
                },
                err => {
                    console.log("Error  == ", err);
                    this.allServicesService.dismissLoading();
                    this.allServicesService.presentAlert(err.error.errormsg);
                }
            );
        } else {
            this.allServicesService.presentAlert('User token expired, please login again.');
            this.router.navigate(['/signin']);
        }
    }, err => {
        this.router.navigate(['/signin']);
    });

}

}
