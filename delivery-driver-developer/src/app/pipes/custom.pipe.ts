import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'userExtract' })

export class UserExtractPipe implements PipeTransform {
  date: any;
  startdate: any;
  enddate: any;
  isSelected: any;
  isday: any;
  weekNames2: any;
  newVal: boolean = true;
  transform(value: any, arg, user_profile,date): any {

    this.weekNames2 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.date = date;

    if (arg === 'dateCheck') {

      this.startdate = '';
      this.enddate = '';
      this.isSelected == true;
      this.isday = value;
      let thisDate1 = this.date.getFullYear() + "/" + (this.date.getMonth() + 1) + "/" + value;
      let d = new Date(thisDate1);
      let n = d.getDay();
 
      if (n == 0) {
        if (user_profile.working.is_sunday != false) {
          this.newVal = true;
        } else {
          this.newVal = false;
        }
      }

      if (n == 1) {
        if (user_profile.working.is_monday != false) {
          this.newVal = true;
        } else {
          this.newVal = false;
        }
      }

      if (n == 2) {
        if (user_profile.working.is_tuesday != false) {
          this.newVal = true;

        } else {
          this.newVal = false;
        }
      }

      if (n == 3) {
        if (user_profile.working.is_wednesday != false) {
          this.newVal = true;

        } else {
          this.newVal = false;
        }
      }

      if (n == 4) {
        if (user_profile.working.is_thursday != false) {
          this.newVal = true;

        } else {
          this.newVal = false;
        }
      }

      if (n == 5) {
        if (user_profile.working.is_friday != false) {
          this.newVal = true;

        } else {
          this.newVal = false;
        }
      }

      if (n == 6) {
        if (user_profile.working.is_saturdy != false) {
          this.newVal = true;

        } else {
          this.newVal = false;
        }
      }
      console.log(thisDate1 + " Week=" + n + " Dayname=" + this.weekNames2[n] + " Working=" + this.newVal);
      return this.newVal;
    }
  }
}