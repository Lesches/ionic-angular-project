import {Component, Input, OnInit} from '@angular/core';
import {Place} from '../../places/place.model';
import {ModalController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  startDate: string;
  endDate: string;


  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);

    if (this.selectedMode === 'random') {
      // tslint:disable-next-line:max-line-length
      this.startDate = new Date(availableFrom.getTime() + Math.random() * (availableTo.getTime()
          - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())).toISOString();

      // tslint:disable-next-line:max-line-length
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime()
          + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString();
    }
   /* this.form = new FormGroup({
      fname: new FormControl(null, {
        updateOn: 'blur', validators: [Validators.required]
      }),
      lname: new FormControl(null, {
        updateOn: 'blur', validators: [Validators.required, Validators.maxLength(180)]
      }),
      count: new FormControl(null, {
        updateOn: 'blur', validators: [Validators.required, Validators.min(1), ]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur', validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur', validators: [Validators.required]
      })
    });*/
  }
    onCancel(){
      this.modalCtrl.dismiss(null, 'cancel');
    }

    onBookPlace() {
    this.modalCtrl.dismiss({message: 'dummy message'}, 'confirm');

    }
}
