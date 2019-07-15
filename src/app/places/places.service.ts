import { Injectable } from '@angular/core';
import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject, of} from 'rxjs';
import {take, map, tap, delay, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {PlaceLocation} from './location.model';

interface PlaceData {
    imageUrl: any;
    availableFrom: string;
availableTo: string;
    description: string;
    price: number;
    title: string;
    userId: string;
    location: PlaceLocation;
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
    return  this.authService.Token.pipe(take(1), switchMap(token => {
          return  this.http.get<{[key: string]: PlaceData}>(
              `https://maga-da45c.firebaseio.com/offered-places.json?auth=${token}`);
      }),
      map(resData => {
    const places = [];
    for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
            places.push(new Place(key, resData[key].title, resData[key].description, resData[key].imageUrl,
                resData[key].price, new Date(resData[key].availableFrom), new Date(resData[key].availableTo), resData[key].userId,
                resData[key].location));
        }
        }
    return places;
       }),
        tap(places => {
            this.place.next(places);
        }));
  }
    getPlace(id: string) {
    return  this.authService.Token.pipe(take(1), switchMap(token => {
          return this.http.get<PlaceData>(
              `https://maga-da45c.firebaseio.com/offered-places${id}.json?auth=${token}`);
    }),
        map(resData => {
              return new Place(id, resData.title, resData.description, resData.imageUrl, resData.price,
                  new Date(resData.availableFrom), new Date(resData.availableTo), resData.userId, resData.location);
          }));
  }

    uploadImage(image: File) {
      const uploadData = new FormData();
      uploadData.append('image', image);

      return this.authService.Token.pipe(take(1), switchMap(token => {
          return this.http.post<{imageUrl: string, imagePath: string}>(
              'https://drive.google.com/open?id=0B-uCSILOnncibTQ0TWRvNWdHakk4WVdUYXNyYU0xNXFpTUlj',
              uploadData, {headers: {Authorization: 'Bearer ' + token}});
      }));
    }

    addPlace(title: string, description: string, price: number, availableFrom: Date, availableTo: Date, location: PlaceLocation,
             imageUrl: string
    ) {
      let generatedId: string;
      let fetchedUserId: string;
      let newPlace: Place;
      return this.authService.UserId.pipe(take(1),
          switchMap(userId => {
fetchedUserId = userId;
return this.authService.Token;
          }), take(1), switchMap(token => {
          if (!fetchedUserId) {
              throw new Error('No user found!');
          }
          newPlace = new Place(Math.random().toString(), title, description, imageUrl, price, availableFrom,
              availableTo, fetchedUserId, location);
          return this.http.post<{name: string}>(`https://maga-da45c.firebaseio.com/offered-places.json?auth=${token}`,
              {...newPlace, id: null});
      }), switchMap(resData => {
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
      let fetchedToken: string;
      return this.authService.Token.pipe(take(1), switchMap(token => {
          fetchedToken = token;
          return this.places;
}), take(1), switchMap(places => {
          if (!places || places.length <= 0) {
              return this.fetchPlaces();
          } else {
              return of (places);
          }

      }),

      switchMap(places => {
              const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
              updatedPlaces = [...places];
              const old = updatedPlaces[updatedPlaceIndex];
              updatedPlaces[updatedPlaceIndex] = new Place(old.id, title, description,
                  old.imageUrl, old.price, old.availableFrom, old.availableTo, old.userId, old.location);

              return this.http.put(`https://maga-da45c.firebaseio.com/offered-places${placeId}.json?auth=${fetchedToken}`,
                  {...updatedPlaces[updatedPlaceIndex], id: null}
              );
          }), tap(() => {
this.place.next(updatedPlaces);
})
);
    }
}
