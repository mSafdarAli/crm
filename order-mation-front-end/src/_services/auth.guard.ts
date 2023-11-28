import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { PermissionService } from './permission.service';


@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private authservice: AuthService, private ps: PermissionService) { }
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (this.authservice.isLoggedIn) {
				return true;
		}
		// not logged in so redirect to login page with the return url
		this.router.navigate(['/login'], { queryParams: { returnUrl: state.url.replace(/\//g, '->') } });
		return false;
	}
}
