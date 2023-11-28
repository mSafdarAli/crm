import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private http: HttpClient) { }

  getSuppliers(params) {
    return this.http.get(environment.api + 'suppliers', { params: params }).pipe(
      map((res) => {
        return res;
      })
    )
  }

  getSingleSupplier(id: string) {
    return this.http.get(environment.api + 'suppliers/' + id).pipe(
      map((res) => {
        return res;
      })
    )
  }

  public getSingleSupplierType() {
    return this.http
      .get(environment.api + 'supplierTypes')
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

  public createOrUpdateSupplier(data: Object) {
    return this.http
      .post(environment.api + 'suppliers/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete(environment.api + 'suppliers/delete/' + id);
  }

  getAllSupplierContacts(id: string) {
    return this.http.get(environment.api + 'supplierContacts/getBySupplierId/' + id).pipe(
      map((res) => {
        return (typeof res['data'] != 'string') ? res : [];
      })
    )
  }

  public createOrUpdateSupplierContacts(data: Object) {
    return this.http
      .post(environment.api + 'supplierContacts/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public deleteContact(id: number) {
    return this.http.delete(environment.api + 'supplierContacts/delete/' + id);
  }

  public getsingleSupplierContact(id: string) {
    return this.http.get(environment.api + 'supplierContacts/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
