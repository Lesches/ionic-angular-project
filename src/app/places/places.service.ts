import { Injectable } from '@angular/core';
import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {take, map, tap, delay} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private place = new BehaviorSubject<Place[]>([
     new Place('p1', 'Manhattan Mansion', 'in the heart of NYC',
         'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042534/Felix_Warburg_Mansion_007.jpg',
         149.99, new Date('2019-1-1'), new Date('2025-12-31'), 'abc'),
    new Place('p2', 'L\'Amour Toujours', 'Romantic place in Paris',
        'https://www.sheetmusicwarehouse.co.uk/image/w555/6681/love-everlasting-lamour-toujours-lamour-song-in-the-key-of-c-major.jpg',
        300.99, new Date('2019-1-1'), new Date('2025-12-31'), 'abc'),
    new Place('p3', 'Trump Tower', 'Hotel in Manhattan',
        'https://ichef.bbci.co.uk/news/660/cpsprodpb/0E14/production/_105240630_gettyimages-1080368310.jpg',
        600.99, new Date('2019-1-1'), new Date('2025-12-31'), 'abc')
  ]);

  get places() {
    return this.place.asObservable();
  }
  constructor(private authService: AuthService, private http: HttpClient) { }
    getPlace(id: string) {
   return this.places.pipe(take(1), map(places => {
     return {...places.find(p => p.id === id)};
   }));

    }

    addPlace(title: string, description: string, price: number, availableFrom: Date, availabeTo: Date) {
      const newPlace = new Place(Math.random().toString(), title, description,
          'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042534/Felix_Warburg_Mansion_007.jpg',
          price, availableFrom, availabeTo, this.authService.UserId);
      return this.http.post('https://maga-da45c.firebaseio.com/offered-places.json', {...newPlace, id: null}).pipe(tap(resData => {
    console.log(resData);
        }));
   //   return this.places.pipe(take(1), delay(1000), tap(places => {
     //     this.place.next(places.concat(newPlace));
 //     }));

    }
    updateOffer(placeId: string, title: string, description: string) {
     return this.places.pipe(take(1), delay(1000), tap(places => {
         const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
         const updatedPlaces = [...places];
         const old = updatedPlaces[updatedPlaceIndex];
         updatedPlaces[updatedPlaceIndex] = new Place(old.id, title, description,
             old.imageUrl, old.price, old.availableFrom, old.availableTo, old.userId);

         this.place.next(updatedPlaces);
     }));
    }
}
