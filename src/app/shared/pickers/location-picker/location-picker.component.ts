import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActionSheetController, AlertController, ModalController} from '@ionic/angular';
import {MapModalComponent} from '../../map-modal/map-modal.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map, switchMap} from 'rxjs/operators';
import {PlaceLocation} from '../../../places/loacation.model';
import {of} from 'rxjs';
import {Plugins, Capacitor} from '@capacitor/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
   @Output()  locationPick = new EventEmitter<PlaceLocation>();
  selectedLocationImage: string;
isLoading = false;
  constructor(private modalCtrl: ModalController, private http: HttpClient, private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController) { }

  ngOnInit() {}
onClickLocation() {
      this.actionSheetCtrl.create({header: 'please choose: ', buttons: [
        {text: 'Auto-Locate', handler: () => {this.locateUser(); }},
              {text: 'Pick on map', handler: () => {this.openMap(); }},
              {text: 'Cancel', role: 'cancel'}
    ]}).then(actionSheetEl => {
    actionSheetEl.present();
});
}

private locateUser() {
if (!Capacitor.isPluginAvailable('Geolocation')) {
this.showErrorAlert();
return;
}

Plugins.Geolocation.getCurrentPosition().then(geoPosition => {
    const coordinates: Coordinates = {lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude};
}).catch(err => {this.showErrorAlert();
});
}

private showErrorAlert() {
    this.alertCtrl.create({header: 'Could not fetch location', message: 'Please pick a location from the map.'})
        .then(alertEl => alertEl.present());
}

private openMap() {
    this.modalCtrl.create({component: MapModalComponent}).then(modalEl => {
        modalEl.onDidDismiss().then(modalData => {
            if (!modalData.data) {
                return;
            }

            const pickedLocation: PlaceLocation = {
                lat: modalData.data.lat,
                lng: modalData.data.lng,
                address: null,
                staticMapImageUrl: null
            };

        });
        modalEl.present();
    });
}

private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
        lat, lng,
        address: null,
        staticMapImageUrl: null
    };
    this.isLoading = true;
    this.getAddress(lat, lng).pipe(switchMap(address => {
        pickedLocation.address = address;
        return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14));
    })).subscribe(staticMapImageUrl => {
        pickedLocation.staticMapImageUrl = staticMapImageUrl;
        this.selectedLocationImage = staticMapImageUrl;
        this.isLoading = false;
        this.locationPick.emit(pickedLocation);
    });
}
    private getAddress(lat: number, lng: number) {
  return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat}, ${lng}&key=${environment.YOUR_API_KEY}`)
      .pipe(map((geoData: any) => {
   if (!geoData || !geoData.results || geoData.results.length === 0) {
     return null;
   }
   return geoData.results[0].formatted_address;
  }));
}

private getMapImage(lat: number, lng: number, zoom: number) {
return `https://maps.googleapis.com/maps/api/staticmap?center=${lat}, ${lng} &zoom=${zoom}&size=600x300&maptype=roadmap
&markers=color:red%7Clabel:Place%7C${lat}, ${lng}&key=${environment.YOUR_API_KEY}`;
}
}
