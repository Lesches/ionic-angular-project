import { Injectable } from '@angular/core';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import {take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanLoad {
  constructor(private authservice: AuthService, private router: Router) {}
  canLoad(
      route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

return this.authservice.UserAuthenticated.pipe(take(1), tap(isAuthenticated => {
  if (isAuthenticated) {
    this.router.navigateByUrl('/auth');
  }
    }));
  }
}
