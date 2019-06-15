import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import {PlacesService} from '../../places.service';
import {Place} from '../../place.model';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
place: Place;
  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private navCtrl: NavController, private modalCtrl: ModalController, private placesService: PlacesService, private route: ActivatedRoute) {

}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });
  }
  onBookPlace() {
    this.modalCtrl.create({component: CreateBookingComponent, componentProps: {selectedPlace: this.place}}).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      console.log(resultData.data, resultData.role);

      if (resultData.role === 'confirm') {
        console.log('booked!');
      }
    });
    }




}
