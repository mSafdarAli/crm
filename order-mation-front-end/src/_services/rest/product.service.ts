import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(params) {
    return this.http.get(environment.api + 'products' , { params: params } ).pipe(
      map((res) => {
        return res;
      })
    );
  }

  

  getSingleProduct(id: string) {
    return this.http.get(environment.api + 'products/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  }

  // getProductsCategory() {
  //   return this.http.get(environment.api + 'productCategory').pipe(
  //     map((res) => {
  //       return res;
  //     })
  //   );
  // }  

  public createOrUpdateProducts(data: Object) {
    return this.http
      .post(environment.api + 'products/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete(environment.api + 'products/delete/' + id);
  }
}
