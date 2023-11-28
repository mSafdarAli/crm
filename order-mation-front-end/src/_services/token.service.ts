import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }
  public updateToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', token);
    }
  }
  public get token(): string {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        return token;
      }
    }
    return "";
  }

}
