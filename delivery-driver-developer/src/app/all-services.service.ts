import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map, retry } from 'rxjs/operators';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Globalization } from '@ionic-native/globalization/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

let Url = 'https://deliverydriver.betaplanets.com/';
let fullUrl = 'https://deliverydriver.betaplanets.com/wp-json/mobileapi/v1/';
let url = 'https://deliverydriver.betaplanets.com/wp-json/wp/v2/';


@Injectable({
    providedIn: 'root'
})
export class AllServicesService {
    loading: any;
    iana_timezone: any;
    one_id: any;
    token: any;

    totalPosts = null;
    pages: any;
    deviceType: any;

    constructor(
        private http: HttpClient,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private toastController: ToastController,
        private globalization: Globalization,
        private oneSignal: OneSignal,
        public nativeStorage: NativeStorage,
        private platform: Platform
    ) { }

    getURL() {
        return Url;
    }


    async presentAlert(msg) {
        let alert = await this.alertCtrl.create({
            header: 'Alert',
            message: msg,
            buttons: [{
                text: 'OK',
                handler: () => {

                }
            }]
        });

        await alert.present();
    }

    async dismissLoading() {
        console.log(this.loading);
        await this.loading.dismiss();
    }

    async showLoader(msg: string = '') {
        if (msg == '') {
            msg = 'Please wait...';
        }
        this.loading = await this.loadingCtrl.create({ message: msg });
        await this.loading.present();
    }

    async presentToast(text) {
        const toast = await this.toastController.create({
            message: text,
            position: 'bottom',
            duration: 2000
        });
        toast.present();
    }

    getData(endPoint) {
        return this.http.get(fullUrl + endPoint).pipe(
            map(data => {
                return data;
            })
        )
    }

    sendData(endPoint, data) {
        return this.http.post(fullUrl + endPoint, data).pipe(
            map(data => {
                return data;
            })
        )
    }

    doLogin(endPoint, data) {
        return this.http.post('https://deliverydriver.betaplanets.com/wp-json/jwt-auth/v1/' + endPoint, data).pipe(
            map(data => {
                return data;
            })
        )
    }

    StripeAddBankAccount(token, bank_new, type: number = 0) {
        return this.http.post(Url + 'wp-json/mobileapi/v1/StripeAddBankAccount', {
            token: token,
            bank_new: bank_new,
            type: type
        });
    }

    save_stripe_account_id(token, stripe_account_id) {
        return this.http.post(Url + 'wp-json/mobileapi/v1/save_stripe_account_id', {
            token: token,
            stripe_account_id: stripe_account_id
        });
    }

    get_stripe_account_id(token) {
        return this.http.post(Url + 'wp-json/mobileapi/v1/get_stripe_account_id', {
            token: token
        });
    }

    GetCards(token) {
        return this.http.post(Url + 'wp-json/mobileapi/v1/StripeGetCards', {
            token: token,
        })
    }
    CreateStripeUser(token, stripeToken, type: number = 0) {
        return this.http.post(Url + 'wp-json/mobileapi/v1/CreateStripeUser', {
            token: token,
            stripeToken: stripeToken,
            type: type
        });
    }

    addCardtoBank(token, stripeToken) {
        return this.http.post(Url + 'wp-json/mobileapi/v1/add_debit_card', {
            token: token,
            type: 'card',
            stripeToken: stripeToken
        });
    }

    GetStripeAuthToken(token, details) {
        return this.http.post(Url + 'wp-json/mobileapi/v1/CreateStripeCaptureBooking', {
            token: token,
            Currency: details.Currency,
            Card: details.Card,
            Amount: details.Amount,
            product_id: details.post_id,
            vendor_id: details.vendor_id
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    saveOneSignID(token, oneSignID, deviceType) {
        this.globalization.getDatePattern({ formatLength: 'string', selector: 'timezone and utc_offset' }).
            then(res => {
                this.iana_timezone = res.iana_timezone
                this.http.post(Url + 'wp-json/mobileapi/v1/save_onesignal_id', {
                    oneSignID: oneSignID,
                    token: token,
                    type: deviceType,
                    timezone: this.iana_timezone
                })
            })
            .catch(e => console.log(e));

        return this.http.post(Url + 'wp-json/mobileapi/v1/save_onesignal_id', {
            oneSignID: oneSignID,
            token: token,
            type: 'ios',
            timezone: this.iana_timezone
        });
    }

    async SaveAutoConfiqure(token) {
        console.log(token);
        if (this.platform.is('cordova')) {
            if (this.platform.is('android')) {
                this.deviceType = 'android';
            } else {
                this.deviceType = 'ios';
            }
            this.oneSignal.getIds().then((id) => {
                this.one_id = id.userId;
                this.token = token;
                this.saveOneSignID(this.token, this.one_id, this.deviceType).subscribe(m => {
                });
            });
        }

    }

    setSetting(setting) {
        if (this.platform.is('cordova')) {
            //return this.nativeStorage.setItem('fancase_user', user);
            this.nativeStorage.setItem('setting', setting)
                .then(
                    () => console.log('Stored item!'),
                    error => console.error('Error storing item', error)
                );
        }
    }

    getStoreSetting() {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.getItem('setting');
        }
    }


    GetSetting() {
        return this.http.post(Url + 'wp-json/mobileapi/v1/GetSetting', {
        });
    }


    getCurrentUserInfo(token) {
        return this.http.post(Url + 'wp-json/mobileapi/v1/getCurrentUserInfo', {
            token: token
        })
    }
    getSecoondUserInfo(token, id) {
        return this.http.post(Url + 'wp-json/mobileapi/v1/getSecoondUserInfo', {
            token: token,
            id: id
        })
    }

    getSecoondUserInfo1(token, id) {
        return this.http.post(Url + 'wp-json/mobileapi/v1/getSecoondUserInfo1', {
            token: token,
            id: id,

        })
    }

    updateCard(token, card, card_new, type) {
        return this.http.post(Url + "wp-json/mobileapi/v1/updateCard", {
            token: token,
            card: card,
            name: card_new.name,
            expMonth: card_new.expMonth,
            expYear: card_new.expYear,
            type: type,
            default: card_new.default
        }).pipe(
            retry(2),
            map(content => {
                return content;
            })
        )
    }

    removeCard(token, card, type) {
        return this.http.post(Url + "wp-json/mobileapi/v1/DeleteCard", {
            token: token,
            card: card,
            type: type
        }).pipe(
            retry(2),
            map(content => {
                return content;
            })
        )
    }

    submitForm(formId, formdata, user_id, user_token) {
        return this.http.post(fullUrl + "submitForm", {
            formId: formId,
            formdata: formdata,
            user_id: user_id,
            user_token: user_token
        })
    }

    getPosts(page = 1, userToken: any = '', mypost: number = 0, c: number = 0): Observable<any[]> {
        let category_url = c ? ("&service_category=" + c) : "";
        let options = {
            observe: "response" as 'body',
            params: {
                per_page: '10',
                page: '' + page
            }
        };

        return this.http.get<any[]>(url + 'posts?_embed&token=' + userToken + "&mypost=" + mypost + category_url, options).pipe(
            map(resp => {
                this.pages = resp['headers'].get('x-wp-totalpages');
                this.totalPosts = resp['headers'].get('x-wp-total');

                let data = resp['body'];

                for (let post of data) {
                    post.media_url = post['media_url'];
                }
                return data;
            })
        )
    }

    getFAQs(page = 1, userToken: any = '', mypost: number = 0, c: number = 0): Observable<any[]> {
        let category_url = c ? ("&service_category=" + c) : "";
        let options = {
            observe: "response" as 'body',
            params: {
                per_page: '10',
                page: '' + page
            }
        };

        return this.http.get<any[]>(url + 'faq_dd?_embed&token=' + userToken + "&mypost=" + mypost + category_url, options).pipe(
            map(resp => {
                this.pages = resp['headers'].get('x-wp-totalpages');
                this.totalPosts = resp['headers'].get('x-wp-total');

                let data = resp['body'];

                for (let post of data) {
                    post.media_url = post['media_url'];
                }
                return data;
            })
        )
    }

    getServicePosts(page = 1, userToken: any = '', mypost: number = 0, c: number = 0): Observable<any[]> {
        let category_url = c ? ("&service_category=" + c) : "";
        let options = {
            observe: "response" as 'body',
            params: {
                per_page: '10',
                page: '' + page
            }
        };

        return this.http.get<any[]>(url + 'barber_services?_embed&token=' + userToken + "&mypost=" + mypost + category_url, options).pipe(
            map(resp => {
                this.pages = resp['headers'].get('x-wp-totalpages');
                this.totalPosts = resp['headers'].get('x-wp-total');

                let data = resp['body'];

                for (let post of data) {
                    post.media_url = post['media_url'];
                }
                return data;
            })
        )
    }

    getPostContent(id) {
        return this.http.get(url + 'posts/' + id + '?_embed').pipe(
            map(post => {
                post['media_url'] = post['media_url'];
                return post;
            })
        )
    }

    getFAQContent(id, token) {
        return this.http.get(url + 'faq_dd/' + id + '?_embed&token=' + token).pipe(
            map(post => {
                post['media_url'] = post['media_url'];
                return post;
            })
        )
    }

    getPostServiceContent(id, token) {
        return this.http.get(url + 'barber_services/' + id + '?_embed&token=' + token).pipe(
            map(post => {
                post['media_url'] = post['media_url'];
                return post;
            })
        )
    }

    make_payment(barber_id, user_token, booking_id, delivery_fees, order_amount, total, card_id, customer, capture, order_type) {
        console.log("SERVICES === ", user_token);
        return this.http.post(Url + 'wp-json/mobileapi/v1/make_payment', {
            barber_id: barber_id,
            token: user_token,
            booking_id: booking_id,
            card_id: card_id,
            customer: customer,
            delivery_fees: delivery_fees, 
            order_amount: order_amount,
            total: total,
            capture: capture,
            order_type: order_type
        });
    }

    deleteNoti(token, nid) {
        return this.http.post(Url + "wp-json/mobileapi/v1/deleteNoti", {
          token: token,
          nid: nid
        });
      }
    
      clear_all_notifications(token) {
        return this.http.post(Url + "wp-json/mobileapi/v1/clear_all_notifications", {
          token: token
        });
      }

      driver_complain(data) {
        console.log("SERVICES === ", data);
        return this.http.post(Url + 'wp-json/mobileapi/v1/driver_complain', {
            token: data.token,
            booking_id: data.booking_id,
            driver_id: data.driver_id,
            phone: data.phone,
            email: data.email,
            description: data.description
        })
    }

}
