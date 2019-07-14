import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionSheetController, AlertController, LoadingController, ModalController, NavController} from '@ionic/angular';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import {PlacesService} from '../../places.service';
import {Place} from '../../place.model';
import {Subscription} from 'rxjs';
import {BookingService} from '../../../bookings/booking.service';
import {AuthService} from '../../../auth/auth.service';
import {MapModalComponent} from '../../../shared/map-modal/map-modal.component';
import {switchMap, take} from 'rxjs/operators';

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
      let fetchedUserId: string;
      this.authservice.UserId.pipe(take(1), switchMap(userId => {
        if (!userId) {
          throw new Error('Found no user');
        }
        fetchedUserId = userId;
        return this.placesService.getPlace(paramMap.get('placeId'));
      })).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== fetchedUserId;
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

    onShowFullMap() {
    this.modalCtrl.create({component: MapModalComponent, componentProps: {
      center: {lat: this.place.location.lat, lng: this.place.location.lng},
      selectable: false,
        closeButtonText: 'Close',
        title: this.place.location.address
      }
      }).then(modalEl => {
      modalEl.present();
    });
    }

    ngOnDestroy(): void {
      if (this.placesSub) {
        this.placesSub.unsubscribe();
      }
    }
}
