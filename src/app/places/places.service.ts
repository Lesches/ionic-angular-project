import { Injectable } from '@angular/core';
import {Place} from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private place: Place[] = [
     new Place('p1', 'Manhattan Mansion', 'in the heart of NYC', 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042534/Felix_Warburg_Mansion_007.jpg', 149.99),
    new Place('p2', 'L\'Amour Toujours', 'Romantic place in Paris', 'https://www.sheetmusicwarehouse.co.uk/image/w555/6681/love-everlasting-lamour-toujours-lamour-song-in-the-key-of-c-major.jpg', 300.99),
    new Place('p3', 'Trump Tower', 'Hotel in Manhattan', 'https://ichef.bbci.co.uk/news/660/cpsprodpb/0E14/production/_105240630_gettyimages-1080368310.jpg', 600.99)
  ];

  get places() {
    return [...this.place];
  }
  constructor() { }
}
