import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  ngAfterViewInit(): void {
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps() {
    const win= window as any;
    const googleModule = win.google();
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
  }
}
