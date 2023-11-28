import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: 'root'
})
export class SalesTargetService {
	constructor(private http: HttpClient) { }

	public getAllSalesTarget(params) {
		return this.http.get(environment.api + 'salesTargets',{params:params}).pipe(map(res => {
			return res;
		}));
	}
	public createOrUpdateSalesTarget(data: Object) {
		return this.http.post(environment.api + 'salesTargets/createOrUpdate', data).pipe(map(res => {
			return res;
		}));
	}
	public getSaleTarget(id: string) {
		return this.http.get(environment.api + 'salesTargets/' + id).pipe(map(res => {
			return res;
		}));
	}
	public delete(id: number) {
		return this.http.delete(environment.api + 'salesTargets/delete/'+ id);
	}
}