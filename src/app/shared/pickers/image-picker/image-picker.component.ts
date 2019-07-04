import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Plugins, Capacitor, CameraSource, CameraResultType} from '@capacitor/core';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string>();
selectedImage: string;
usePicker = false;
  constructor(private platform: Platform) { }

  ngOnInit() {
    console.log('Mobile:', this.platform.is('mobile'));
    console.log('Hybrid:', this.platform.is('hybrid'));
    console.log('iOS:', this.platform.is('ios'));
    console.log('Android:', this.platform.is('android'));
    console.log('Desktop:', this.platform.is('desktop'));
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.usePicker = true;
    }
  }
onPickImage() {
if (!Capacitor.isPluginAvailable('Camera') || this.usePicker) {
  this.filePickerRef.nativeElement.click();
  return;
}
Plugins.Camera.getPhoto({
  quality: 50,
  source: CameraSource.Prompt,
  correctOrientation: true,
  height: 320,
  width: 200,
  resultType: CameraResultType.Base64
}).then(image => {

}).catch(error => {
  this.selectedImage = image.base64Data;
  this.imagePick.emit(image.base64Data);
  console.log(error);
  return false;
  });
}

onFileChosen(event: Event) {
  console.log(event);
}
}
