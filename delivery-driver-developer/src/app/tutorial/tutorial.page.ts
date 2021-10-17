import { Component, OnInit,ViewChild } from '@angular/core';
import { IonSlides} from '@ionic/angular';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {
  @ViewChild('mySlider',{static:true})  slides: IonSlides;
  constructor() { }

  ngOnInit() {
  }

  swipeNext(){
    console.log('Hello');
    this.slides.slideNext();
  }
  swipePrevious(){
    console.log('Hello');
    this.slides.slidePrev();
  }
}

