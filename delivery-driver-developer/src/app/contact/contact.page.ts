import { ViewChild, Component, OnInit } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { Router } from '@angular/router';
import { MenuController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { Events } from '@ionic/angular';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.page.html',
    styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
    signature = '';
    isDrawing = false;


    public signatureImage: string;


    form_id: any = '';
    form_title: any = '';
    loggedinUserId: any;
    user_token: any;
    loading: any;

    gravityForm: FormGroup;
    user: any;
    notificationCount: any;
    userData: any = [];
    today: any = [];
    cdate: any;
    formID: any;
    forms: any = [];
    formsData: any = [];
    entry: any = [];
    hiddenFields: any = [];
    lat: any;

    formid: any;
    selectedPhoto: any;
    log: any;
    loadings: any;
    dynamicFormFields: any;
    cTime: any;
    map: any;
    shwPre: any;
    latLng: any;
    address: any;
    userID: any;
    submitted;
    dataGet: any;
    dataValue: any = [];
    mapOptions: any;
    form_path: any;
    company_images: any = { company_banner: "", company_logo: "" };
    content_ready: boolean = false;
    form: any;
    gForm: any;
    form_ready: boolean = false;
    form_fields: any;
    form_value: any;
    form_value2: any;
    error_message: any;
    gravity_error: any;

    imageURI: any = '';
    smallURI: any = '';
    imageSRC: any = '';
    image_field_id: any;
    images: any = [];

    file_upload_success: any;
    image_file_value: any = [];
    image_field_value: any = {};

    page_title: any;
    report_type: any;

    case_id: any;
    case_title: any;

    indexCount: any;;

    forms_data: any = { form_fields: "", formvalue: "" };

    imageFiles: any = ['png', 'jpg', 'gif'];
    docFiles: any = ['pdf'];
    
    constructor(
        public route: ActivatedRoute,
        public allServices: AllServicesService,
        public router: Router,
        public menu: MenuController,
        public events: Events,
        public storage: Storage,
        public formBuilder: FormBuilder,
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        private platform: Platform,
        private location: Location,
        private _DomSanitizationService: DomSanitizer
    ) { }

    ngOnInit() {
        this.gravity_error = {};
        this.form_value = {};
        this.form_value2 = {};
    }

    drawComplete() {
        this.isDrawing = false;
    }

    drawStart() {
        this.isDrawing = true;
    }

    ionViewWillEnter() {
        this.menu.enable(false);
        this.storage.get('user').then((val) => {
            console.log('userData: ', val);
            if (val != null) {
                console.log(val);
                this.loggedinUserId = val.user_id;
                this.user_token = val.token;

                this.form_id = 1;
                this.indexCount = 1;
                this.case_id = 0;
                this.form_title = '';
                this.form_value = {};
                this.form_value2 = {};
                this.form_ready = false;;
                this.error_message = '';
                this.gravity_error = {};
                this.image_field_value = [];
                this.image_field_value = {};
                this.allServices.getData('get_forms/?token=' + this.user_token + '&form_id=' + this.form_id + '&case_id=' + this.case_id).subscribe(res => {
                    this.form = res;

                    this.form_title = this.form.forms.title;
                    this.case_title = this.form.case_title;
                    this.form_fields = this.form.forms.fields;
                    this.form = this.form.forms;
                    this.form_ready = true;
                    console.log(this.form_fields);

                    let form_res = {
                        indexCount: this.indexCount,
                        form_id: this.form_id,
                        entry_id: this.random(),
                        form_value: '',
                        form_fields: this.form
                    }
                    this.events.publish('CheckList:Create', form_res);

                    if (this.form_title == '') {
                        this.allServices.presentAlert("No Checklist found!!");
                    }

                    this.form_value = {};
                    this.form_value2 = {};

                    this.error_message = '';
                    this.gravity_error = {};
                    this.image_field_value = [];
                    this.image_field_value = {};
                });


            } else {
                this.dismissLoading();
            }
        });

    }

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    Save_Form() {
        if (this.isEmpty(this.form_value)) {
            this.allServices.presentAlert("Please fill details.");
            return false;
        } else {

            //this.showLoader("Submitting...");

            Object.keys(this.form_value2).forEach(key => {
                this.form_value[key] = this.form_value2[key];
            });
            console.log('111: ', this.form_value);


            //==========>>>>>>>>>> to send the custom data inside first input that can be filter with gform_after_submission hook later.

            this.form_fields.forEach(element => {
                if (element.type == 'date') {
                    let old_date = this.form_value['input_' + element.id];
                    old_date = moment(old_date).format("YYYY/MM/DD");
                    this.form_value['input_' + element.id] = old_date;
                }

                if (element.type == 'time') {
                    let old_time = this.form_value['input_' + element.id];
                    if (element.timeFormat == "12") {
                        old_time = moment(old_time).format("h:mm A");
                    }
                    else {
                        old_time = moment(old_time).format("HH:mm");
                    }
                    this.form_value['input_' + element.id] = old_time;
                }
            });

            console.log("FORM: ", this.form_value);

            this.saveForm2();

        }

    }


    random(): number {
        let rand = Math.floor(Math.random() * 10000000000000000) + 1;
        return rand;
    }

    saveForm() {
        let form_res = {
            indexCount: this.indexCount,
            form_id: this.form_id,
            entry_id: this.random(),
            form_value: this.form_value,
            form_fields: this.form
        }
        this.events.publish('CheckList:Create', form_res);
        this.location.back();
    }

    saveForm2() {
        console.log('MY FORM: ', this.form_value);
        this.showLoader("Submitting...");
        this.allServices.submitForm(this.form.id, this.form_value, this.loggedinUserId, this.user_token)
            .subscribe(res2 => {
                let res: any = [];
                res = res2;
                console.log('Form VALUES: ', res);
                if (res.is_valid == true) {
                    this.form_value = {};
                    this.form_value2 = {};
                    this.form_ready = false;;
                    this.gravity_error = {};
                    this.dismissLoading();
                    this.error_message = '';
                    this.form_ready = true;
                    this.allServices.presentAlert(res.confirmation_message);
                } else {
                    this.gravity_error = {};
                    let validation_msg = res.validation_messages;
                    let er = '';
                    for (var k in validation_msg) {
                        if (validation_msg.hasOwnProperty(k)) {
                            this.gravity_error[k] = validation_msg[k];
                        }
                    }
                    this.dismissLoading();
                }
            },
                err => {
                    this.dismissLoading();
                    this.error_message = "Some fields are empty / something went wrong."
                    //console.log();
                });
    }


    handleCheckbox(f, name, event) {
        let fi = "input_" + f;
        if (event.checked == true) {

            this.form_value2[fi] = name.value;
            console.log(this.form_value2);
            return true;
        } else {
            this.form_value2[fi] = '';
            return false;
        }

    }



    async showLoader(msg) {
        console.log('Loadd');
        this.loading = await this.loadingCtrl.create({ backdropDismiss: true, message: msg });
        this.loading.present();
    }
    async dismissLoading() {
        console.log('dismiss');
        await this.loading.dismiss();
    }



    addphotos(fields) {
        let field_id = fields.id;
        if (this.platform.is('cordova')) {
            this.image_field_id = field_id;
            if (this.images.length < 5) {

            } else {
                this.allServices.presentAlert('Sorry you can not upload more then 5 images');
            }

        } else {
            console.log('get me 3');
        }
    }

    remove_image(fi, i) {
        console.log(i);
        this.image_field_value["input_" + fi].splice(i, 1);
        this.form_value['gform_uploaded_files'] = JSON.stringify(this.image_field_value);
        console.log(this.form_value);
    }



    Save_Form_Values() {
        let sExist = false;
        this.form_fields.forEach(element => {

        });

        if (sExist == false) {
            console.log("Here 11");
            this.Save_Form();
        }

    }

}

