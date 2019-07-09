import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

interface AuthResponseData {
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
private userIsAuthenticated = false;
private userId = null;

get userAuthenticated() {
  return this.userIsAuthenticated;
}

get UserId() {
  return this.userId;
}
  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
return this.http.post<AuthResponseData>(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.firebaseAPIKey}`,
    {email, password, returnSecureToken: true});
  }

  login() {
    this.userIsAuthenticated = true;
  }

  logout() {
    this.userIsAuthenticated = false;
  }


}
