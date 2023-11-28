import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/_services/rest/loading.service';
import * as e from 'express';



@Injectable()

export class LoaderInterceptor implements HttpInterceptor {
	constructor(private loading: LoadingService) { }
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if(!request.params.get("noloading")) {
			this.loading.start();
		}
		return next.handle(request);
	}
}
