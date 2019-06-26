import { Injectable } from '@angular/core';
import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {take, map, tap, delay, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

interface PlaceData {
    imageUrl: any;
    availableFrom: string;
availableTo: string;
    description: string;
    price: number;
    title: string;
    userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private place = new BehaviorSubject<Place[]>([]);

  get places() {
    return this.place.asObservable();
  }
  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return  this.http.get<{[key: string]: PlaceData}>('https://maga-da45c.firebaseio.com/offered-places.json').pipe(map(resData => {
    const places = [];
    for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
            places.push(new Place(key, resData[key].title, resData[key].description, resData[key].imageUrl,
                resData[key].price, new Date(resData[key].availableFrom), new Date(resData[key].availableTo), resData[key].userId));
        }
        }
    return places;
       }),
        tap(places => {
            this.place.next(places);
        }));
  }
    getPlace(id: string) {
   return this.http.get<PlaceData>(`https://maga-da45c.firebaseio.com/offered-places${id}.json`).pipe(map(resData => {
return new Place(id, resData.title, resData.description, resData.imageUrl, resData.price, new Date(resData.availableFrom), new Date(resData.availableTo), resData.userId);
   }));

    }

    addPlace(title: string, description: string, price: number, availableFrom: Date, availabeTo: Date) {
      let generatedId: string;
      const newPlace = new Place(Math.random().toString(), title, description,
          'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042534/Felix_Warburg_Mansion_007.jpg',
          price, availableFrom, availabeTo, this.authService.UserId);
      return this.http.post<{name: string}>('https://maga-da45c.firebaseio.com/offered-places.json',
          {...newPlace, id: null}).pipe(switchMap(resData => {
              generatedId = resData.name;
              return this.places;
        }), take(1), tap(places => {
            newPlace.id = generatedId;
            this.place.next(places.concat(newPlace));
      }));
   //   return this.places.pipe(take(1), delay(1000), tap(places => {
     //     this.place.next(places.concat(newPlace));
 //     }));

    }
    updateOffer(placeId: string, title: string, description: string) {
      let updatedPlaces: Place[];

      return  this.places.pipe(take(1), switchMap(places => {
              const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
              updatedPlaces = [...places];
              const old = updatedPlaces[updatedPlaceIndex];
              updatedPlaces[updatedPlaceIndex] = new Place(old.id, title, description,
                  old.imageUrl, old.price, old.availableFrom, old.availableTo, old.userId);

              return this.http.put(`https://maga-da45c.firebaseio.com/offered-places${placeId}.json`,
              {...updatedPlaces[updatedPlaceIndex], id: null}
          );
      }), tap(() => {
this.place.next(updatedPlaces);
})
);
    }
}
