import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';
import { AuthService } from 'src/_services/auth.service';
import { TokenService } from 'src/_services/token.service';
import { LoadingService } from 'src/_services/rest/loading.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	errors = {
		'Gateway Timeout': 'Server is not responding'
	};
	constructor(private _auth: AuthService, private toastr: ToastrService, private tokenService: TokenService, private router: Router, private loading: LoadingService) {

	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		return next.handle(request).pipe(
			tap((evt: any) => {
				if (evt.body) {
					this.loading.end();
					if (evt.body.token) {
						this.tokenService.updateToken(evt.body.token);
						this._auth.updateUser();
					}
				}
			}),
			catchError(res => {
				this.loading.end();
				if (res.status === 401) {
					// auto logout if 401 response returned from api
					this._auth.logout();
					this.router.navigateByUrl('/login');
				}
				let error = res.error.message || res.statusText 
				if(res.status === 400){
					error = (res.error.errors) ? res.error.errors: res.error.message;
				}
				let r = '';
				if (typeof error === 'object') {
					Object.keys(error).forEach(field => {
						const e = error[field];
						r += '<p>' + field.substr(0, 1).toUpperCase() + field.substr(1, 100) + ': ' + e[0] + '</p>';
					});
				}
				if (r) {
					this.toastr.error(r, '', {
						timeOut: 6000,
						enableHtml: true
					});
				} else {
					this.toastr.error(error, 'Error');
				}
				return throwError(() => res);
			}));
	}
	errorMsg(error: string) {
		if (this.errors[error] !== undefined) {
			return this.errors[error];
		}
		return error;
	}
}
