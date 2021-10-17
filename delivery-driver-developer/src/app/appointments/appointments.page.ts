import { Component, OnInit } from '@angular/core';

import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';
@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {
  date: any;
  startdate: any;
  enddate: any;
  isSelected: any;
  isday: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  weekNames: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  weekNames2: any;

  user: any;
  ready: boolean = false;
  calready: boolean = false;
  res: any;
  list: any;

  service: any = {};
  price: any = {};
  time: any = {};
  item: any = {};
  selecteddate: any;
  serviceName: any = {};


  addCheckListForm: FormGroup;
  form_value: any;
  user_id: any;
  user_info: any;
  is_monday: boolean = false;
  is_tuesday: boolean = false;
  is_wednesday: boolean = false;
  is_thursday: boolean = false;
  is_friday: boolean = false;
  is_saturdy: boolean = false;
  is_sunday: boolean = false;




  monday: any
  tuesday: any
  wednesday: any
  thursday: any
  friday: any
  saturdy: any
  sunday: any

  is_formServiceValid: boolean = false;
  is_formdateValid: boolean = false;
  avilable_time_slot: any = [];

  timeready: boolean = true;
  is_currentdate: boolean = false;
  first_load: boolean = false;

  arrayItems: {
    service: number;
    price: string;
    time: string
  }[];

  private currentNumber = 0;
  constructor(
    public alertCtrl: AlertController,
    public allServicesService: AllServicesService,
    public loadingCtrl: LoadingController,
    public router: Router,
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public location: Location,
    public storage: Storage,
    private _formBuilder: FormBuilder) {
    this.user_id = this.route.snapshot.parent.paramMap.get('user_id');
    this.addCheckListForm = this._formBuilder.group({
      demoArray: this._formBuilder.array([]),
      'select_day': new FormControl('', Validators.compose([

      ])),
      'select_time': new FormControl('', Validators.compose([
        Validators.required,

      ])),

    });

    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.weekNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.weekNames2 = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.date = new Date();

  }

  ionViewDidLoad() {

  }

  get demoArray() {
    return this.addCheckListForm.get('demoArray') as FormArray;
  }
  addItem(item) {
    this.arrayItems.push(item);
    this.demoArray.push(this._formBuilder.control(false));
  }
  removeItem() {
    this.arrayItems.pop();
    this.demoArray.removeAt(this.demoArray.length - 1);
  }


  ngOnInit() {
    this.storage.get('user').then(userInfo => {
      if (userInfo != null) {
        this.user = userInfo;
        this.GetServices();
        this.getDaysOfMonth();
        let date_booking = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        this.first_load = true;
        this.GetBookingAvialableSlot(year + "-" + month + "-" + date_booking, this.user.token, this.user_id);
      } else {
        this.router.navigate(['/signin']);
      }
    }, err => {
      this.router.navigate(['/signin']);
    });
  }

  getDaysOfMonth() {
    this.calready = false;
    this.GetUserProfile(this.user_id);
  }
  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
    this.getDaysOfMonth();
  }

  private increment(post_id) {
    let val = this.addCheckListForm.controls["item_" + post_id].value;
    let val2 = parseInt(val) + 1
    this.addCheckListForm.controls["item_" + post_id].setValue(val2);
  }

  private decrement(post_id) {
    let val = this.addCheckListForm.controls["item_" + post_id].value;
    if (val > 0) {
      let val2 = parseInt(val) - 1
      this.addCheckListForm.controls["item_" + post_id].setValue(val2);
    }
  }
  selectDate(day) {
    this.startdate = '';
    this.enddate = '';
    this.isSelected == true;
    this.isday = day;
    let thisDate1 = this.date.getFullYear() + "/" + (this.date.getMonth() + 1) + "/" + day;
    let d = new Date(thisDate1);
    let n = d.getDay();
    let weekday = this.weekNames2[n];
    this.addCheckListForm.controls['select_day'].setValue(weekday);
    this.is_formdateValid = true;
    this.selecteddate = (this.date.getMonth() + 1) + '/' + day + '/' + this.date.getFullYear();
    let date_booking = this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + day;
    this.GetBookingAvialableSlot(date_booking, this.user.token, this.user_id);
    this.is_currentdate = true;
    if (day == this.currentDate) {
      this.is_currentdate = false;
    } else {
      this.is_currentdate = true;
    }

  }

  GetServices() {
    this.allServicesService.getData('getUserServices/?type=public&token=' + this.user_id).subscribe(data => {
      this.res = data;
      console.log(this.res);
      if (this.res.status = 'ok') {
        this.ready = true;
        this.list = this.res.list;
        let group = {}
        this.list.forEach(input_template => {
          if (input_template.checked) {
            this.serviceName[input_template.post_id] = input_template.post_title;
            let price_field = "price_" + input_template.post_id;
            let service_field = "service_" + input_template.post_id;
            let items = "item_" + input_template.post_id;
            let time_field = "time_" + input_template.post_id;

            group[price_field] = new FormControl(input_template.value.price);
            group[service_field] = new FormControl(false, Validators.required);
            group[items] = new FormControl(0, Validators.required);
            group[time_field] = new FormControl(input_template.value.time);
          }
        })
        group['select_day'] = new FormControl()
        group['select_time'] = new FormControl()
        this.addCheckListForm = new FormGroup(group);
      }
    }, (err) => {
      this.ready = true;
      if (err.error.error_code == "user_expire") {

        this.allServicesService.presentAlert(err.error.errormsg);
        this.router.navigate(['/signin']);
      }
      this.allServicesService.presentAlert(err.error.errormsg);
    })
  }

  GetUserProfile(user_id) {
    this.allServicesService.getData('getProfile/?token=' + user_id + '&type=public').subscribe(data => {
      this.res = data;
      if (this.res.status = 'ok') {
        this.calready = true;
        this.user_info = this.res;
        this.userWorkingDaytime(this.user_info);
        this.daysInThisMonth = new Array();
        this.daysInLastMonth = new Array();
        this.daysInNextMonth = new Array();
        this.currentMonth = this.monthNames[this.date.getMonth()];
        this.currentYear = this.date.getFullYear();
        if (this.date.getMonth() === new Date().getMonth()) {
          this.currentDate = new Date().getDate();
        } else {
          this.currentDate = 999;
        }

        var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
        var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
        for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
          this.daysInLastMonth.push(i);
        }

        var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
        for (var i = 0; i < thisNumOfDays; i++) {
          this.daysInThisMonth.push(i + 1);
        }

        var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
        var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDate();
        for (var i = 0; i < (6 - lastDayThisMonth); i++) {
          this.daysInNextMonth.push(i + 1);
        }
        var totalDays = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;
        if (totalDays < 36) {
          for (var i = (7 - lastDayThisMonth); i < ((7 - lastDayThisMonth) + 7); i++) {
            this.daysInNextMonth.push(i);
          }
        }
      }





    }, (err) => {
      this.calready = true;
      this.allServicesService.presentAlert(err.error.errormsg);
      if (err.error.error_code == "user_expire") {
        this.location.back();
      }
    })
  }

  userWorkingDaytime(user_profile) {
    if (user_profile.working.is_sunday != false) {
      this.is_sunday = true;
      this.sunday = user_profile.working.is_sunday;
    } else {
      this.is_sunday = false;
    }

    if (user_profile.working.is_monday != false) {
      this.is_monday = true;
      this.monday = user_profile.working.is_monday;
    } else {
      this.is_monday = false;
    }

    if (user_profile.working.is_tuesday != false) {
      this.is_tuesday = true;
      this.tuesday = user_profile.working.is_tuesday;
    } else {
      this.is_tuesday = false;
    }


    if (user_profile.working.is_wednesday != false) {
      this.is_wednesday = true;
      this.wednesday = user_profile.working.is_wednesday;
    } else {
      this.is_wednesday = false;
    }

    if (user_profile.working.is_thursday != false) {
      this.is_thursday = true;
      this.thursday = user_profile.working.is_thursday;
    } else {
      this.is_thursday = false;
    }

    if (user_profile.working.is_friday != false) {
      this.is_friday = true;
      this.friday = user_profile.working.is_friday;
    } else {
      this.is_friday = false;
    }

    if (user_profile.working.is_saturdy != false) {
      this.is_saturdy = true;
      this.saturdy = user_profile.working.is_saturdy;
    } else {
      this.is_saturdy = false;
    }

  }

  addServices() {
    console.log(this.addCheckListForm.value)
    this.form_value = this.addCheckListForm.value;
    console.log(this.form_value);

    this.is_formServiceValid = false;

    for (var key in this.form_value) {
      if (this.form_value.hasOwnProperty(key)) {
        if (typeof this.form_value[key] != 'undefined') {
          if (key.substring(0, 5) === "item_") {
            let realkey = key;
            let thenum = key.match(/\d+/)[0];
            this.item[thenum] = this.form_value[realkey];
          }

          if (key.substring(0, 6) === "price_") {
            let realkey = key;
            let thenum = key.match(/\d+/)[0];
            this.price[thenum] = this.form_value[realkey];
          }

          if (key.substring(0, 5) === "time_") {
            let realkey = key;
            let thenum = key.match(/\d+/)[0];
            this.time[thenum] = this.form_value[realkey];
          }



          if (key.substring(0, 8) === "service_") {
            let realkey = key;
            let thenum = key.match(/\d+/)[0];
            this.service[thenum] = this.form_value[realkey];
            if (this.form_value[realkey] == true) {
              //this.is_formServiceValid = true;
              if (this.form_value["item_" + thenum] == 0) {
                this.is_formServiceValid = false;
              } else {
                this.is_formServiceValid = true;
              }
            }
          }
        }
      }
    }


    if (this.is_formServiceValid && this.is_formdateValid) {

      let processData = {
        service: this.service,
        price: this.price,
        item: this.item,
        time: this.time,
        select_day: this.addCheckListForm.value.select_day,
        select_date: this.selecteddate,
        select_time: this.addCheckListForm.value.select_time,
        selecteddate: this.selecteddate,
        Servicesname: this.serviceName
      };
      console.log(processData);
      this.storage.set('cart', processData);

      this.router.navigate(['/invoice/' + this.user_id]);
    } else {
      this.allServicesService.presentAlert("Please provide details for booking");
      return false;
    }

  }


  async GetBookingAvialableSlot(selecteddate, token, user_id) {

    this.timeready = false;
    let dataPost = {
      token: token,
      barber_id: user_id,
      date: selecteddate
    }
    this.avilable_time_slot = [];
    this.addCheckListForm.controls['select_time'].setValue("");
    this.allServicesService.sendData('get_barber_booked_time_on_date', dataPost).subscribe(data => {
      this.res = data;
      if (this.res.status = 'ok') {
        this.avilable_time_slot = this.res.avilable_time_slot;

        if (this.avilable_time_slot.length > 0) {
          this.is_formdateValid = true;
        } else {
          this.is_formdateValid = false
          this.allServicesService.presentAlert("Sorry, you can not do booking for this user today.")
        }
        this.timeready = true;


        // just select day first time
        let res = selecteddate.split("-");
        let date_booking = new Date().getDate();
        let thisDate1 = this.date.getFullYear() + "/" + (this.date.getMonth() + 1) + "/" + res[2];
        let d = new Date(thisDate1);
        let n = d.getDay();
        let weekday = this.weekNames2[n];
        console.log(weekday);
        this.selecteddate=selecteddate;
        this.addCheckListForm.controls['select_day'].setValue(weekday);
        //}



      }
    }, (err) => {
      this.calready = true;
      this.allServicesService.presentAlert(err.error.errormsg);
      this.is_formdateValid = false
      this.timeready = true;
      if (err.error.error_code == "user_expire") {
        this.location.back();
      }
    })
  }

  SelectService(event, service) {
    if (event.detail.checked == true) {
      console.log(service);
      this.addCheckListForm.controls['item_' + service].setValue(1);
    } else {
      console.log(service);
      this.addCheckListForm.controls['item_' + service].setValue(0);
    }

  }

  GetTimeComplied(){
    
  }

} 
