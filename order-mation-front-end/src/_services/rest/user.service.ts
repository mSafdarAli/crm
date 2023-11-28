import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { lookupdata } from "src/_models/lookup";

@Injectable({
    providedIn: 'root'
})
export class UserService {    
    constructor(private http: HttpClient) { }

    public changePassword(data: Object) {
        return this.http.post(environment.api + 'auth/changePassword', data).pipe(map(res => {
            return res;
        }));
    }
    public getRep(userId: string) {
        return this.http.get(environment.api + 'users/getUsersWithLinkedContacts/' + userId).pipe(map(res => {
            if(res['statusDescription']=='Ok'){
                var DataList : lookupdata[] = [];
                res['data'].map(e => {
                    DataList.push({name : e.firstName + ' ' + e.lastName , value : e.id.toString()});
                    
                });
                return DataList;
            }
            return null
        }));
    }    
  
    public getAllUsers(params) {
        return this.http.get(environment.api + 'users',{params : params} ).pipe(map(res => {
            return res;
        }));
    }
    public getLinkedContacts(id : string) {
        return this.http.get(environment.api + 'userLinkedContacts?userId='+id).pipe(map(res => {
            return (typeof res['data'] != 'string') ? res : [];
        }));
    }
    public getUser(id : string) {
   
        return this.http.get(environment.api + 'users/' + id).pipe(map(res => {
             return res;
        }));
    }
    public createOrUpdateUser (data : Object) {
        return this.http.post(environment.api + 'users/createOrUpdate' , data).pipe(map(res => {
            return res;
        }));
    }
    public createOrUpdateLinkedContact(data : Object) {
        return this.http.post(environment.api + 'userLinkedContacts/createOrUpdate' , data).pipe(map(res => {
            return res;
        }));
    }

    public deleteUser(id: number) {
        return this.http.delete(environment.api + 'users/delete/' + id).pipe(map(res => {
            return res;
        }));
    }
    public deleteLinkedUser(id: number) {
        return this.http.delete(environment.api + 'userLinkedContacts/delete/' + id).pipe(map(res => {
            return res;
        }));
    }
    public getSingleLinkedContacts(id: number) {
        return this.http.get(environment.api + 'userLinkedContacts/' + id).pipe(map(res => {
            return (typeof res['data'] != 'string') ? res : [];
        }));
    }
}