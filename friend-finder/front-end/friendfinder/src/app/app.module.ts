import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componants/header/header.component';
import { FooterComponent } from './componants/footer/footer.component';
import { SignUpComponent } from './componants/sign-up/sign-up.component';
import { ContactComponent } from './componants/contact/contact.component';
import { UserhomeComponent } from './componants/userhome/userhome.component';
import { LeftBarComponent } from './componants/userhome/left-bar/left-bar.component';
import { RightBarComponent } from './componants/userhome/right-bar/right-bar.component';
import { PublishComponent } from './componants/userhome/publish/publish.component';
import { FriendsComponent } from './componants/userhome/friends/friends.component';
import { CoolImagesComponent } from './componants/userhome/cool-images/cool-images.component';
import { MainPageComponent } from './componants/userhome/main-page/main-page.component';
import { TimeLinesComponent } from './componants/time-lines/time-lines.component';
import { TimeLineComponent } from './componants/time-lines/time-line/time-line.component';
import { TimeAboutComponent } from './componants/time-lines/time-about/time-about.component';
import { TimeAlbumComponent } from './componants/time-lines/time-album/time-album.component';
import { TimeFriendsComponent } from './componants/time-lines/time-friends/time-friends.component';
import { TimeLineProfileComponent } from './componants/time-lines/time-line-profile/time-line-profile.component';
import { TimeLineDetailesComponent } from './componants/time-lines/time-line-detailes/time-line-detailes.component';
import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './componants/login/login.component';
import {LoginActivator} from "../service/Activator/login-activator";
import {APP_BASE_HREF} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "../service/interceptors/auth.interceptor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ScreenActivator} from "../service/Activator/screen-activator";
import { FriendProfileComponent } from './componants/friend-profile/friend-profile.component';
import { FriendAboutComponent } from './componants/friend-profile/friend-about/friend-about.component';
import { FriendAlbumComponent } from './componants/friend-profile/friend-album/friend-album.component';
import { FriendFriendsComponent } from './componants/friend-profile/friend-friends/friend-friends.component';
import { FriendTimeComponent } from './componants/friend-profile/friend-time/friend-time.component';
import { ProfileComponent } from './componants/friend-profile/profile/profile.component';
import { SearchComponent } from './componants/search/search.component';


// http://localhost:4200


const routes: Routes = [
  {path: 'mainpage', component: MainPageComponent,canActivate: [ScreenActivator]},
  {
    path: '',
    component: TimeLinesComponent, // the wrapper layout
    children: [
      { path: 'timeline', component: TimeLineComponent,canActivate: [ScreenActivator] },
      { path: 'timeline-about', component: TimeAboutComponent,canActivate: [ScreenActivator] },
      { path: 'timeline-album', component: TimeAlbumComponent ,canActivate: [ScreenActivator] },
      { path: 'timeline-friends', component: TimeFriendsComponent,canActivate: [ScreenActivator]}
    ],canActivate: [ScreenActivator]
  },  {
    path: '',
    component: FriendProfileComponent, // the wrapper layout
    children: [
      { path: 'time/:id', component: FriendTimeComponent,canActivate: [ScreenActivator] },
      { path: 'profile', component: ProfileComponent ,canActivate: [ScreenActivator]},
      { path: 'about/:id', component: FriendAboutComponent,canActivate: [ScreenActivator] },
      { path: 'album/:id', component: FriendAlbumComponent ,canActivate: [ScreenActivator] },
      { path: 'friends/:id', component: FriendFriendsComponent,canActivate: [ScreenActivator]}
    ],canActivate: [ScreenActivator]
  },
  {path: 'profile/:id', component: ProfileComponent ,canActivate: [ScreenActivator]},
  {path: 'contact', component: ContactComponent,canActivate: [ScreenActivator]},
  {path: 'timeline', component: TimeLineComponent,canActivate: [ScreenActivator]},
  // {path: 'timeline-about', component: TimeAboutComponent,canActivate: [ScreenActivator]},
  {path: 'timeline-friends', component: TimeFriendsComponent,canActivate: [ScreenActivator]},
  {path: 'timeline-album', component: TimeAlbumComponent ,canActivate: [ScreenActivator]},
  {path: 'login', component: LoginComponent, canActivate: [LoginActivator]},
  {path: 'signup', component: SignUpComponent, canActivate: [LoginActivator]},
  {path: 'search/:keyword', component: SearchComponent, canActivate: [ScreenActivator]},
  {path: 'search', component: SearchComponent, canActivate: [ScreenActivator]},

  { path: 'timelinerofile', component: TimeLineProfileComponent ,canActivate: [ScreenActivator]},
  { path: 'timelinerofile/:id', component: TimeLineProfileComponent ,canActivate: [ScreenActivator]},
  { path: '', redirectTo: '/mainpage', pathMatch: 'full' },
  { path: '**', redirectTo: '/mainpage', pathMatch: 'full' }
];
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SignUpComponent,
    ContactComponent,
    UserhomeComponent,
    LeftBarComponent,
    RightBarComponent,
    PublishComponent,
    FriendsComponent,
    CoolImagesComponent,
    MainPageComponent,
    TimeLinesComponent,
    TimeLineComponent,
    TimeAboutComponent,
    TimeAlbumComponent,
    TimeFriendsComponent,
    TimeLineProfileComponent,
    TimeLineDetailesComponent,
    LoginComponent,
    FriendProfileComponent,
    FriendAboutComponent,
    FriendAlbumComponent,
    FriendFriendsComponent,
    FriendTimeComponent,
    ProfileComponent,
    SearchComponent,

  ],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        HttpClientModule,
        //NgbPaginationModule,
        FormsModule,
        ReactiveFormsModule
    ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: RouteReuseStrategy,
      useClass: class implements RouteReuseStrategy {
        shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }
        store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {}
        shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }
        retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null { return null; }
        shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
          return future.routeConfig === curr.routeConfig && future.params['id'] === curr.params['id'];
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
