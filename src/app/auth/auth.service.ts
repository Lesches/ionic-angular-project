import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {User} from './user.model';
import {map} from 'rxjs/operators';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<User>(null);

get UserAuthenticated() {
  return this.user.asObservable().pipe(map(user => {
    if (user) {return !!user.Token; }  else {
      return false;
    }
  }));
}

get UserId() {
  return this.user.asObservable().pipe(map(user => {
    if (user) {
      return user.id; } else {
      return null;
    }}));
}
  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
return this.http.post<AuthResponseData>(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.firebaseAPIKey}`,
    {email, password, returnSecureToken: true});
  }

  login(email: string, password: string) {
    return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.firebaseAPIKey}`,
        {email, password, returnSecureToken: true});
  }

  logout() {
    this.user.next(null);
  }


}
