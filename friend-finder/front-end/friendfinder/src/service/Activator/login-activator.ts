import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginActivator implements CanActivate{
  constructor(private authService: AuthService, private router: Router) {}
  // tslint:disable-next-line:max-line-length
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isUserLogIn()) {
      return true;
    }

    this.router.navigateByUrl('/mainpage');
    return false;
  }
}
