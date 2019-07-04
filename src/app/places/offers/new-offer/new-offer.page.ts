import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {PlacesService} from '../../places.service';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {PlaceLocation} from '../../location.model';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  constructor(private placesService: PlacesService, private router: Router, private loadeingCtrl: LoadingController) { }
    form: FormGroup;
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur', validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur', validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur', validators: [Validators.required, Validators.min(1), ]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur', validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur', validators: [Validators.required]
      }),
      Location: new FormControl(null, {validators: [Validators.required]})
    });

  }

  onLocationPicked(location: PlaceLocation) {
this.form.patchValue({location});
  }

  onImagePicked(imageData: string) {

  }

  onCreateOffer() {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }
    console.log(this.form.value);
    this.loadeingCtrl.create({
      message: 'Creating place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.uploadImage(this.form.get('image').value).pipe(switchMap(uploadRes => {
    return  this.placesService.addPlace(this.form.value.title, this.form.value.description,
          +this.form.value.price, new Date(this.form.value.dateFrom), new Date(this.form.value.dateTo),
          this.form.value.location); })).subscribe(() => {
          loadingEl.dismiss();

          this.form.reset();
          this.router.navigate(['/places/tabs/offers']);
      });
    });
  }

}
