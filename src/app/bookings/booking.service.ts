import { Injectable } from '@angular/core';
import {Booking} from './booking.model';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {delay, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookings = new BehaviorSubject<Booking[]>([]);


constructor(private authService: AuthService, private http: HttpClient) {

  }

  get Bookings() {
    return this.bookings.asObservable();
  }

  addBooking(placeId: string, placeTitle: string, placeImage: string, fname: string, lname: string, guestNumber: number,
             dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    const newBooking = new Booking(Math.random().toString(), placeId, this.authService.UserId,
        placeTitle, placeImage, fname, lname, guestNumber, dateFrom, dateTo);
    return this.http.post<{name: string}>('https://maga-da45c.firebaseio.com/bookings.json',
        {...newBooking, id: null}).pipe(switchMap(resData => {
          generatedId = resData.name;
          return this.bookings;
    }),
        take(1), tap(bookings => {
      newBooking.id = generatedId;
      this.bookings.next(bookings.concat(newBooking));
    }));
  }

  cancelBooking(bookingId: string) {
    return this.bookings.pipe(take(1), delay(1000), tap(bookings => {
          this.bookings.next(bookings.filter(b => b.id !== bookingId));
        }
    ));
  }
fetchBookings() {
  this.http.get(`https://maga-da45c.firebaseio.com/bookings.json?ordereBy="UserId"&equalTo="${this.authService.UserId}"`)
      .pipe(bookingData => {
    const bookingData = [];
    for (const key in bookingData) {
      if (bookingData.hasOwnProperty(key)) {
        bookings.push(new Booking(key), bookingData[key].placeId);
      }
    }
  });
}

}
