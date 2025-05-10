import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../service/auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }
  // tslint:disable-next-line:typedef
  logOut() {
    sessionStorage.removeItem('token');
    this.router.navigateByUrl('/login'); // rice
  }

  // tslint:disable-next-line:typedef
  isUserLogin(){
    return this.authService.isUserLogIn();
  }

  // tslint:disable-next-line:typedef
  login() {
    this.router.navigateByUrl('/login');
  }

  // tslint:disable-next-line:typedef
  signup() {
    this.router.navigateByUrl('/signup');
  }
}
