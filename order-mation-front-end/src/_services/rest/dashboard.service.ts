import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    constructor(private http: HttpClient) { }

    public salesTotal(data: Object) {
        return this.http.post(environment.api + 'Dashboard/salesTotals', data).pipe(map(res => {
            return res;
        }));
    }
    public salesPerRep(data: Object) {
        return this.http.post(environment.api + 'Dashboard/salesPerRep', data).pipe(map(res => {
            return res;
        }));
    }
    public salesVsTarget(data: Object) {
        return this.http.post(environment.api + 'Dashboard/salesVsTargetsAnnual', data).pipe(map(res => {
            return res;
        }));
    }
}