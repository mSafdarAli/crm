import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  constructor(private http: HttpClient) {}

  getProductCategory(params) {
    return this.http.get(environment.api + 'productCategory',{params:params}).pipe(
      map((res) => {
        return res;
      })
    );
  }

  

  getSingleProductCategory(id: string) {
    return this.http.get(environment.api + 'productCategory/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  } 

  public createOrUpdateProductCategory(data: Object) {
    return this.http
      .post(environment.api + 'productCategory/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete(environment.api + 'productCategory/delete/' + id);
  }
}
