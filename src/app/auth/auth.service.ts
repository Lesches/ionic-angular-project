import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private userIsAuthenticated = false;
private userId = 'abc';

get userAuthenticated() {
  return this.userIsAuthenticated;
}

get UserId() {
  return this.userId;
}
  constructor() { }

  login() {
    this.userIsAuthenticated = true;
  }

  logout() {
    this.userIsAuthenticated = false;
  }
}
