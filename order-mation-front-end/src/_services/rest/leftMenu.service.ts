import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LeftMenuService {
    Isleftbar: boolean = false;
    constructor(private http: HttpClient) { }

    public leftMenuData(id: string) {
        return this.http.get(environment.api + 'sitePages/getByUser/' + id).pipe(map(res => {
            return res;
        }))
    }

    public toggleSidebar() {
        
        this.Isleftbar = !this.Isleftbar

    }

    public getReportUrl() {
        return this.http.get(environment.api + 'reports').pipe(map(res => {
            return res;
        }))
    }
}