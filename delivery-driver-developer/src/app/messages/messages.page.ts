import { Component, OnInit } from '@angular/core';
//import  firebase from 'firebase/app';
import { AllServicesService } from '../all-services.service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { NavigationExtras } from '@angular/router';
import { AlertController, LoadingController, NavController, MenuController, Platform, Events } from '@ionic/angular';
import { Routes, RouterModule, ActivatedRoute,Router } from '@angular/router';
var obj = {};
@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  loading: any;
  userID: any;
  res: any = [];
  ref: any;
  ref3: any;
  tmp1: any = [];
  loading_spinner: boolean;
  ref2: any;
  chatlistData: any = [];
  constructor(
    public navCtrl: NavController,
    public serviceForAllService: AllServicesService,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public router: Router,
  ) {
    this.fetchChatList();
  }

  ngOnInit() {
  }

  fetchChatList() {
    this.loading_spinner = true;
    this.storage.get('user').then((val) => {
      console.log(val);
      if (val != null) {
        this.serviceForAllService.getCurrentUserInfo(val.token).subscribe((result) => {
          this.res = result;
          this.userID = this.res.result.id;
          let msgdata, msgdata2 = '';
          console.log('current_user=' + this.userID);
          //this.ref = firebase.database().ref('chatbox/' + this.userID);
          this.ref.on('value', (data) => {
            obj = {};
            data.forEach((data1) => {
              console.log('inside', data1);
              //this.ref3 = firebase.database().ref('chatbox/' + this.userID + '/' + data1.key).orderByChild('unread').equalTo(1);
              this.ref3.on('value', (data2) => {
                 //obj[data1.key] = Object.keys(data2.val()).length;
                console.log(obj);
              });
              //this.ref2 = firebase.database().ref('chatbox/' + this.userID + '/' + data1.key).limitToLast(1).orderByKey();
              this.ref2.once('value', (data4) => {
                data4.forEach((data3) => {
                  let msg = data3.val().message;
                  let newMsg = msg.slice(0, 20) + '...';
                  console.log('details opf1', obj);
                  console.log('details opf2', data1.key);
                  if (obj[data1.key]) {
                    this.tmp1.push({ "unread": obj[data1.key], "secondUserID": data3.val().secondUserID, "media": data3.val().media, "secondUserName": data3.val().user2, "image": '', "message": newMsg, "time1": data3.val().time, "time": moment(data3.val().time).fromNow() });
                  } else {
                    this.tmp1.push({ "unread": 0, "secondUserID": data3.val().secondUserID, "media": data3.val().media, "secondUserName": data3.val().user2, "image": '', "message": newMsg, "time1": data3.val().time, "time": moment(data3.val().time).fromNow() });
                  }
                });

              });
            })
            console.log("Temporary Data=" + JSON.stringify(this.tmp1));
            console.log(this.tmp1);
            if (this.tmp1.length > 0) {
              this.getSecoondUserInfo(this.tmp1);
            } else {
              this.loading_spinner = false;
            }
          })


        },
          err => {
            console.log(err);
          })
      }else{
        this.router.navigate(['/signin']);
      }
    },err=>{
      this.router.navigate(['/signin']);
    })



  }


  async showLoader() {
    this.loading = await this.loadingCtrl.create({ message: 'Please wait...' });
    this.loading.present();
  }
  async dismissLoading() {
    console.log(this.loading);
    await this.loading.dismiss();
  }

  getSecoondUserInfo(temp) {
    //let tmp = this.tmp1.reverse();
    console.log(temp);
    this.chatlistData = [];
    this.storage.get('user').then((val) => {
      console.log(val);
      if (val != null) {
        this.serviceForAllService.getSecoondUserInfo1(val.token, temp).subscribe((result) => {
          this.res = result;
          console.log(this.res.result);
          this.chatlistData = this.res.result;
          this.chatlistData.sort((b, a) => {
            console.log('time1' + a.msg_time);
            console.log('time2' + b.msg_time);
            var keyA = new Date(a.msg_time),
              keyB = new Date(b.msg_time);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });

          console.log(this.chatlistData);
          this.loading_spinner = false;
        }, (err) => {
          console.log("error...", err);
          this.loading_spinner = false;
          let msg = err.error.errormsg;
        });
      }
    });
  }


  sendToMessage(userProfile) {
    this.storage.get('user').then((val) => {
      console.log(val);
      if (val != null) {
        this.showLoader();
        this.serviceForAllService.getCurrentUserInfo(val.token).subscribe((result) => {
          this.res = result;
          this.openChatPage(userProfile, this.res.result);
          this.dismissLoading();
        }, (err) => {
          this.dismissLoading();
          console.log("error...", err);
          let msg = err.error.errormsg;
          console.log(err);
        });
      }
    });
  }
  openChatPage(userProfile, Currentuser) {

    let userPro = {
      id: userProfile.id,
      first_name: userProfile.display_name, 
      user_img: userProfile.user_img,
    };
    let navigationExtras: NavigationExtras = {
      queryParams: {
        //  special: JSON.stringify(workout),
        secondUser: JSON.stringify(userPro),
        currentUser: JSON.stringify(Currentuser),
        fromMy: true
      }
    };
    console.log(userPro,'user', Currentuser);
    this.navCtrl.navigateForward(['/chat'], navigationExtras);
  }
}
