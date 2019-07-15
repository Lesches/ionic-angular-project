import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, from} from 'rxjs';
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
export class AuthService implements OnDestroy{
  private user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

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

get Token() {
  return this.user.asObservable().pipe(map(user => {
    if (user) {
      return user.Token; } else {
      return null;
    }}));
}
  constructor(private http: HttpClient) { }

  autoLogin() {
  return from(Plugins.Storage.get({key: 'authData'})).pipe(map(storedData => {
    if (!storedData || !storedData.value) {
      return null;
    }

    const parsedData = JSON.parse(storedData.value) as {token: string; tokenExpirationDate: string; userId: string, email: string};
    const expirationTime = new Date(parsedData.tokenExpirationDate);
    if (expirationTime <= new Date()) {
      return null;
    }
    const user = new User(parsedData.userId, parsedData.email, parsedData.token, expirationTime);
    return user;
  }),
      tap(user =>  {
if (user) {
  this.user.next(user);
  this.autoLogout(user.tokenDuration);
}
    }), map(user => {
      return !!user;
      }));
}
  signup(email: string, password: string) {
return this.http.post<AuthResponseData>(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.firebaseAPIKey}`,
    {email, password, returnSecureToken: true}).pipe(tap(this.setUserData).bind(this));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://www.googleapis
    .com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.firebaseAPIKey}`,
        {email, password, returnSecureToken: true}).pipe(tap(this.setUserData).bind(this));
  }

  logout() {
    if (this.activeLogoutTimer) {
         clearTimeout(this.activeLogoutTimer);
    }
    this.user.next(null);
    Plugins.storage.set({key: 'authData'});
  }

  ngOnDestroy(): void {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private autoLogout(duration: number) {
    if (!this.activeLogoutTimer) {
    } else {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
this.logout();
  }, duration);
  }

private setUserData(userData: AuthResponseData) {
  const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
  const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
  this.user.next(user);
  this.autoLogout(user.tokenDuration);
  this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
}

private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
  const data = JSON.stringify({userId, token, tokenExpirationDate, email});

  Plugins.Storage.set({key: 'authData', value: data});
}
}
