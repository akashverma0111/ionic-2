import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-report-company',
  templateUrl: './report-company.page.html',
  styleUrls: ['./report-company.page.scss'],
})
export class ReportCompanyPage implements OnInit {

  constructor(public alertCtrl: AlertController) { }
  async showAlert() {  
    const alert = await this.alertCtrl.create({  
      header: 'User Reported',  
      message: 'A member of our team will reach out to you',
      buttons: ['OK'] ,
      cssClass: 'alertReport'
    });  
    await alert.present();  
    const result = await alert.onDidDismiss();  
    console.log(result);  
  }  

  ngOnInit() {
  }

}
