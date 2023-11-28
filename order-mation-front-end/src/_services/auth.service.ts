import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { User } from 'src/_models';
import { APIResponse } from 'src/_models/server';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private checkLogin = new BehaviorSubject<boolean>(false);
  loginOB = this.checkLogin.asObservable();
  private user = new BehaviorSubject<User | null>(null);
  userInfo = this.user.asObservable();
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router, private tokenService: TokenService) {
  }
  public login(userName: string, password: string) {
    return this.http.post<{ success: boolean, error: boolean, token?: string, message: string }>(environment.api + 'master/login', { userName, password })
      .pipe(map(res => {
        if (res && res.token) {
          this.tokenService.updateToken(res.token);
          this.updateUser();
        }
        return res;
      }));
  }
  public forgotPassword(userName: string) {
    return this.http.post(environment.api + 'auth/resetPassword', {userName} ).pipe(map(res => {
			return res;
		}));     
  }
  
  public get isLoggedIn(): boolean {
    let loggedin = !this.jwtHelper.isTokenExpired(this.tokenService.token);
    // if (loggedin) {
    // 	loggedin = Boolean(this.cookieService.get('sessionCookieId'));
    // }
    if (loggedin === false) {
      this.logout();
    }
    this.checkLogin.next(loggedin);
    return loggedin;
  }
  // public get userDetails(): User {
  //   return this.user.value;
  //   }
  public get loggedIn(): boolean {
    return this.checkLogin.value;
  }

  public updateUser(): void {
    this.user.next(this.jwtHelper.decodeToken(this.tokenService.token));
  }
  public get userDetails(): User {
    if (this.checkLogin.value === true) {
      if (this.user.value === null) {
        this.updateUser();
      }
      return this.user.value;
    } else {
      return null;
    }
  }

  logout() {
    // remove user from local storage to log user out
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('menu');
    }
    this.checkLogin.next(false);
    this.user.next(null);
    this.router.navigate(['/login']);
  }
}
