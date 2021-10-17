import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.page.html',
  styleUrls: ['./contact-page.page.scss'],
})
export class ContactPagePage  {

  constructor(public alertCtrl: AlertController) { }
  async showAlert() {  
    const alert = await this.alertCtrl.create({  
      header: 'Your submission is complete!',  
      buttons: ['OK'] ,
      cssClass: 'alertCustom'
    });  
    await alert.present();  
    const result = await alert.onDidDismiss();  
    console.log(result);  
  }  
}