import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  constructor(private router: Router, private navCtrl: NavController, private modalCtrl: ModalController) { }

  ngOnInit() {
  }
  onBookPlace() {
    this.modalCtrl.create()
  }

}
