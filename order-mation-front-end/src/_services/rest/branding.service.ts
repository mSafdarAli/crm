import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class BrandingService {
  constructor(private http: HttpClient) {}

  getBrandings(params) {
    return this.http.get(environment.api + 'brandings', { params: params } ).pipe(
      map((res) => {
        return res;
      })
    );
  }

  

  getSingleBranding(id: string) {
    return this.http.get(environment.api + 'brandings/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  } 

  public createOrUpdateBranding(data: Object) {
    return this.http
      .post(environment.api + 'brandings/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete(environment.api + 'brandings/delete/' + id);
  }
}
