import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../service/auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {NgModel} from "@angular/forms";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchKey: string = '';
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  @ViewChild('searchModel', { static: false }) searchModel!: NgModel;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {}

  performSearch(): void {
    console.log('Perform search called with:', this.searchKey);

    if (!this.searchKey || !this.searchKey.trim()) {
      console.log('Search term is empty');
      return;
    }

    const searchTerm = encodeURIComponent(this.searchKey.trim());
    console.log('Navigating to search with term:', searchTerm);

    this.router.navigate(['/search', searchTerm]).then(navigationSuccess => {
      console.log('Navigation success:', navigationSuccess);
      if (navigationSuccess) {
        this.searchKey = '';
        if (this.searchModel) {
          this.searchModel.reset();
        }
      }
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  onSearchEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.performSearch();
    }
  }


  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login').then(() => {
          window.location.reload(); // Only if absolutely necessary
        });
      },
      error: () => {
        this.router.navigateByUrl('/login').then(() => {
          window.location.reload(); // Only if absolutely necessary
        });
      }
    });
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
