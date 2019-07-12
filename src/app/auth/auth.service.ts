import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {User} from './user.model';
import {map, tap} from 'rxjs/operators';
import {Plugins} from '@capacitor/core';

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
    {email, password, returnSecureToken: true}).pipe(tap(this.setUserData).bind(this));
  }

  login(email: string, password: string) {
    return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.firebaseAPIKey}`,
        {email, password, returnSecureToken: true}.pipe(tap(this.setUserData).bind(this)));
  }

  logout() {
    this.user.next(null);
  }

private setUserData(userData: AuthResponseData) {
  const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
  this.user.next(new User(userData.localId, userData.email, userData.idToken, expirationTime));
}

private storeAuthData(userId: string, token: string, tokenExpirationDate: string) {
  Plugins.Storage.set();
}
}
