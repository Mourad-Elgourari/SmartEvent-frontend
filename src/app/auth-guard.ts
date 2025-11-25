import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import {Auth} from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = this.auth.getToken(); // ✅ check if token exists

    if (token) {
      return true; // user is authenticated → allow access
    } else {
      // not logged in → redirect to login page
      return this.router.parseUrl('/login');
    }
  }
}
