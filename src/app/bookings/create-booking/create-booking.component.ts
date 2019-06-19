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
  form: FormGroup;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.form = new FormGroup({
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
    });
  }
    onCancel(){
      this.modalCtrl.dismiss(null, 'cancel');
    }

    onBookPlace() {
    this.modalCtrl.dismiss({message: 'dummy message'}, 'confirm');

    }
}
