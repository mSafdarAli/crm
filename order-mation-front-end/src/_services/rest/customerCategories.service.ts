import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerCategoriesService {
  constructor(private http: HttpClient) {}


  getCustomerCategories(params){
    return this.http.get(environment.api + 'customerCategories' ,{params:params}).pipe(
      map((res) => {
        return res;
      })
    )
  }

  getSingleCustomerCategories(id : string ){
    return this.http.get(environment.api + 'customerCategories/' + id ).pipe(
      map((res) => {
        return res;
      })
    )
  }

  public createOrUpdateCustomersCategories(data: Object) {
    return this.http
      .post(environment.api + 'customerCategories/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete(environment.api + 'customerCategories/delete/' + id);
  }
  
}
