import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionSheetController, AlertController, LoadingController, ModalController, NavController} from '@ionic/angular';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import {PlacesService} from '../../places.service';
import {Place} from '../../place.model';
import {Subscription} from 'rxjs';
import {BookingService} from '../../../bookings/booking.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  private placesSub: Subscription;
  isLoading = false;
  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private navCtrl: NavController, private modalCtrl: ModalController,
              private placesService: PlacesService, private route: ActivatedRoute, private actionSheetCtrl: ActionSheetController,
              private bookingService: BookingService, private loadingCtrl: LoadingController, private authservice: AuthService,
              private alertCtrl: AlertController) {

}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      this.placesSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== this.authservice.UserId;
        this.isLoading = false;
          }, error => {
        this.alertCtrl.create({header: 'An error occurred!', message: 'Could not load place.', buttons: [{text: 'Okay', handler: () => {
          this.router.navigate(['/places/tabs/discover']);
            }}]}).then(alertEl => alertEl.present());
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
          this.loadingCtrl.create({message: 'Booking place...'}).then(loadingEl => {
            loadingEl.present();
            const data = resultData.data.bookingData;
            this.bookingService.addBooking(this.place.id, this.place.title, this.place.imageUrl, data.fname, data.lname,
                data.guestNumber, data.startDate, data.endDate).subscribe(() => {
                  loadingEl.dismiss();
            });
              }

          );
        }
      });
    }

    ngOnDestroy(): void {
      if (this.placesSub) {
        this.placesSub.unsubscribe();
      }
    }
}
