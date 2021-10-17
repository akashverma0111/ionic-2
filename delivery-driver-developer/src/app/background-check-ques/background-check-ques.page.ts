import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { AllServicesService } from "../all-services.service";
import { AlertController, LoadingController, NavController, MenuController, ToastController, Events, } from "@ionic/angular";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ActionSheetController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
    selector: 'app-background-check-ques',
    templateUrl: './background-check-ques.page.html',
    styleUrls: ['./background-check-ques.page.scss'],
})
export class BackgroundCheckQuesPage implements OnInit {

    backgroundQuestionForm: FormGroup;

    user: any = [];
    loading: any;
    action: any = '';
    buttonText: any = 'Next';

    questions: any = [];
    ready: boolean;

    question1: any;
    question2: any;
    question3: any;
    question4: any;
    question5: any;

    constructor(
        public allServicesService: AllServicesService,
        public loadingCtrl: LoadingController,
        public router: Router,
        public alertCtrl: AlertController,
        public menu: MenuController,
        public actionSheetController: ActionSheetController,
        public toastController: ToastController,
        public storage: Storage,
        public events: Events,
        private route: ActivatedRoute,
        private ref: ChangeDetectorRef
    ) {
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;
                if (this.action == 'update') {
                    this.get_background_questions();
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
            }else{
                this.ready = true;
            }
        });

    }

    ngOnInit() {
        this.backgroundQuestionForm = new FormGroup({
            'question1': new FormControl(""),
            'question2': new FormControl(""),
            'question3': new FormControl(""),
            'question4': new FormControl(""),
            'question5': new FormControl("")
        });
    }

    get_background_questions() {
        this.ready = false;
        this.allServicesService.getData('get_background_questions/?token=' + this.user.token).subscribe((result) => {
            this.ready = true;
            let res: any = [];
            res = result;
            this.questions = res.questions;
            console.log('this.questions: ', this.questions);
            this.question1 = this.questions.question1;
            this.question2 = this.questions.question2;
            this.question3 = this.questions.question3;
            this.question4 = this.questions.question4;
            this.question5 = this.questions.question5;
            // this.backgroundQuestionForm.controls['questions1'].setValue(this.questions.question1);
            // this.backgroundQuestionForm.controls['questions2'].setValue(this.questions.question2);
            // this.backgroundQuestionForm.controls['questions3'].setValue(this.questions.question3);
            // this.backgroundQuestionForm.controls['questions4'].setValue(this.questions.question4);
            // this.backgroundQuestionForm.controls['questions5'].setValue(this.questions.question5);

            this.ref.detectChanges();
    
        }, (err) => {
            this.ready = true;
            console.log("error...", err);
        });
    }

    // submit_background_questions() {
    //     this.storage.get('user').then(userInfo => {
    //         if (userInfo != null) {
    //             this.user = userInfo;

    //             this.user.completed_step = 'background_check_ques';

    //             this.storage.set('user_profile', this.user);
    //             this.storage.set('user', this.user);

    //             this.router.navigate(['/profile-popup']);

    //         } else {
    //             this.allServicesService.presentAlert('User token expired, please login again.');
    //             this.router.navigate(['/signin']);
    //         }
    //     }, err => {
    //         this.router.navigate(['/signin']);
    //     });
    // }

    save_submit_background_questions(formValue) {
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
                this.allServicesService.sendData('save_background_check_questions', formValue).subscribe(
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
    
                            this.events.publish('user:save_background_check_ques', this.user);
    
                            if (this.action == 'update') {
                                this.router.navigate(['/background-check-ques']);
                            } else {
                                this.user.completed_step = 'background_check_ques';
                                this.storage.set('user_profile', this.user);
                                this.storage.set('user', this.user);
                                this.router.navigate(['/profile-popup']);
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


    skip() {
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;

                this.user.completed_step = 'background_check_ques';

                this.storage.set('user_profile', this.user);
                this.storage.set('user', this.user);

                this.router.navigate(['/profile-popup']);

            } else {
                this.allServicesService.presentAlert('User token expired, please login again.');
                this.router.navigate(['/signin']);
            }
        }, err => {
            this.router.navigate(['/signin']);
        });
    }

}
