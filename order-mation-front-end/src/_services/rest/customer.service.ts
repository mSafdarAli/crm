import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) { }

  public getcustomers(params) {
    return this.http.get(environment.api + 'customers', { params: params }).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public createOrUpdateCustomers(data: Object) {
    return this.http
      .post(environment.api + 'customers/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete(environment.api + 'customers/delete/' + id);
  }

  public getSingleCustomer(id: string) {
    return this.http.get(environment.api + 'customers/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  }
  public getCustomerCategories(active) {
    return this.http.get(environment.api + 'customerCategories').pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map(e => {
            DataList.push({ name: e.description, value: e.id });

          });
          return DataList;
        }
        return null
      })
    );
  }
  public getAccountTypes() {
    return this.http
      .get(environment.api + 'referenceCodes/getByType/AccountType')
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map(e => {
              DataList.push({ name: e.description, value: e.id });

            });
            return DataList;
          }
          return null
        })
      );
  }
  public getRegion() {
    return this.http.get(environment.api + 'provinces').pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map(e => {
            DataList.push({ name: e.description, value: e.id });

          });
          return DataList;
        }
        return null
      })
    );
  }
 
  public getStatus() {
    return this.http
      .get(environment.api + 'referenceCodes/getByType/CustomerStatus')
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map(e => {
              DataList.push({ name: e.description, value: e.id });

            });
            return DataList;
          }
          return null
        })
      );
  }
  public createOrUpdateCustomerContacts(data: Object) {
    return this.http
      .post(environment.api + 'customerContacts/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  public getcustomersContacts(id:string) {
    return this.http.get(environment.api + 'customerContacts/getByCustomerId/'+id).pipe(
      map((res) => {
        return (typeof res['data'] != 'string') ? res : [];
      })
    );
  }
  public deleteContact(id: number) {
    return this.http.delete(environment.api + 'customerContacts/delete/' + id);
  }
  
  public getsingleContacts(id:string) {
    return this.http.get(environment.api + 'customerContacts/'+id).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public getSingleCustomerContact(params=null) {
    return this.http.get(environment.api + 'customerContacts', {params:params}).pipe(
      map((res) => {
        return (typeof res['data'] != 'string') ? res : [];
      })
    );
  }
}
