import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class LoadingService {
	private _loading = new BehaviorSubject<number>(0);
	loading = this._loading.asObservable();
	public start() {
		this._loading.next(this._loading.value + 1);
	}
	public end() {
		if (this._loading.value > 0) {
			this._loading.next(this._loading.value - 1);
		}
	}
}