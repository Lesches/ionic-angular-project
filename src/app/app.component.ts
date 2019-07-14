import {Component, OnDestroy, OnInit} from '@angular/core';

import { Platform } from '@ionic/angular';
import {Plugins, Capacitor} from '@capacitor/core';

import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private previousAuthState = false
  ) {
    this.initializeApp();
  }

  initializeApp() {
    if (Capacitor.isPluginAvailable('SplashScreen')) {
      Plugins.SplashScreen.hide();
    }
    this.platform.ready().then(() => {
         });
  }

  ngOnInit() {
   this.authSub = this.authService.UserAuthenticated.subscribe(isAuth => {
     if (!isAuth && this.previousAuthState !== isAuth) {
       this.router.navigateByUrl('/auth');
     }
     this.previousAuthState = isAuth;
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
