import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { lookupdata } from "src/_models/lookup";

@Injectable({
    providedIn: 'root'
})
export class SiteRolesService {
    constructor(private http: HttpClient) { }
    
    public getRoles() {
        return this.http.get(environment.api + 'siteRoles' ).pipe(map(res => {
            if(res['statusDescription']=='Ok'){
                var DataList : lookupdata[] = [];
                res['data'].map(e => {
                    DataList.push({ name: e.description, value: e.id });

                });
                return DataList;
            }
            return null
        }));
    }

    public getRolesId() {
        return this.http.get(environment.api + 'siteRoles').pipe(map(res => {
            if (res['statusDescription'] == 'Ok') {
                var DataList: lookupdata[] = [];
                res['data'].map(e => {
                    DataList.push({ name: e.description, value: e.id });

                });
                return DataList;
            }
            return null
        }));
    }

    public sitePages() {
        return this.http.get(environment.api + 'sitePages/').pipe(map(res => {
            return res;
        }
        ));
    }
    public createOrUpdateRoles(data: Object) {
        return this.http.post(environment.api + 'siteRoles/createOrUpdate', data).pipe(map(res => {
            return res;
        }
        ));
    }
    public createOrUpdatePages(data: Object) {
        return this.http.post(environment.api + 'sitePages/createOrUpdate', data).pipe(map(res => {
            return res;
        }
        ));
    }
    public getSitePages(id: number) {
        return this.http.get(environment.api + 'sitePages/' + id).pipe(map(res => {
            return res;
        }
        ));
    }
}