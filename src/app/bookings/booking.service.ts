import { Injectable } from '@angular/core';
import {Booking} from './booking.model';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {delay, map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  fname: string;
  guestNumber: number;
  lname: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

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
  let newBooking: Booking;
  return this.authService.UserId.pipe(take(1), switchMap(userId => {
    if (!userId) {
      throw new Error('No user id found!');
    }
    newBooking = new Booking(Math.random().toString(), placeId, userId,
        placeTitle, placeImage, fname, lname, guestNumber, dateFrom, dateTo);
    return this.http.post<{name: string}>('https://maga-da45c.firebaseio.com/bookings.json',
        {...newBooking, id: null}); }),
      switchMap(resData => {
          generatedId = resData.name;
          return this.bookings;
    }),
        take(1), tap(bookings => {
      newBooking.id = generatedId;
      this.bookings.next(bookings.concat(newBooking));
    }));
  }

  cancelBooking(bookingId: string) {
  return this.http.delete(`https://maga-da45c.firebaseio.com/bookings/${bookingId}.json`).pipe(switchMap(() => {
return this.bookings;
    }), take(1), tap(bookings => {
    this.bookings.next(bookings.filter(b => b.id !== bookingId));
  }));
  }
fetchBookings() {
 return this.authService.UserId.pipe(take(1), switchMap(userId => {
    if (!userId) {
      throw new Error('User not found!');
    }
    return this.http.get<{[key: string]: BookingData}>(
        `https://maga-da45c.firebaseio.com/bookings.json?ordereBy="UserId"&equalTo="${this.authService.UserId}"`)
        .pipe(map(bookingData => {
          const bookings = [];
          for (const key in bookingData) {
            if (bookingData.hasOwnProperty(key)) {
              bookings.push(new Booking(key, bookingData[key].placeId, bookingData[key].userId, bookingData[key].placeTitle,
                  bookingData[key].placeImage, bookingData[key].fname, bookingData[key].lname, bookingData[key].guestNumber,
                  new Date(bookingData[key].bookedFrom), new Date(bookingData[key].bookedTo)));
            }
          }
          return bookings;
        }), tap(bookings => {
          this.bookings.next(bookings);
        }));
      }
  ));
}
}
