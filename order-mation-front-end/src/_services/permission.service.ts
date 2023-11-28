import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';



@Injectable({
	providedIn: 'root'
})
export class PermissionService {
	constructor(private authService: AuthService, private http: HttpClient) {
	}
	public getPermissions(id: number) {
		 return this.http.get(environment.api + 'users/getUserPages/' + id).pipe(map(res => {
			if (res['statusCode'] == 200) {
				localStorage.setItem('permisssions', JSON.stringify(res['data'].pages));
				 
			}
			return null
		}));
	}
	public havePerm(role: string): boolean {
		const perm = JSON.parse(localStorage.getItem('permisssions'));
		if (this.authService.loggedIn && perm.indexOf(role)>-1) {

			return true;
		}
		return false;
	}
	// public check(permission: string): boolean {
	// 	if(permission) {
	// 		const p = permission.split(',');
	// 		return this.havePerm(p);
	// 	}
	// 	return true
	// }
}
