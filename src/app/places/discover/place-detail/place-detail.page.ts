import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import {PlacesService} from '../../places.service';
import {Place} from '../../place.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
place: Place;
private placesSub: Subscription;
  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private navCtrl: NavController, private modalCtrl: ModalController,
              private placesService: PlacesService, private route: ActivatedRoute, private actionSheetCtrl: ActionSheetController) {

}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placesSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
          }
      );
    });
  }
  onBookPlace() {
    this.actionSheetCtrl.create({
      header: 'Choose an action',
      buttons: [
        {
          text: 'Select Date', handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date', handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel', role: 'cancel'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });

    }

    openBookingModal(mode: 'select' | 'random') {
      console.log(mode);
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

    ngOnDestroy(): void {
      if (this.placesSub) {
        this.placesSub.unsubscribe();
      }
    }
}
