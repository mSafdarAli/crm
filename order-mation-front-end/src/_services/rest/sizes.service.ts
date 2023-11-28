import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class SizesService {
  constructor(private http: HttpClient) {}

  getSizes(params) {
    return this.http.get(environment.api + 'sizes',{params:params}).pipe(
      map((res) => {
        return res;
      })
    );
  }

  

  getSingleSize(id: string) {
    return this.http.get(environment.api + 'sizes/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getSizesType() {
    return this.http.get(environment.api + '/referenceCodes/getByType/SizeType').pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map(e => {
            DataList.push({ name: e.description, value: e.code });

          });
          return DataList;
        }
        return null
      })
    );
  }

  public createOrUpdateSizes(data: Object) {
    return this.http
      .post(environment.api + 'sizes/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete(environment.api + 'sizes/delete/' + id);
  }
}
