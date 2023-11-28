import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class ColoursService {
  constructor(private http: HttpClient) {}

  getColours(params){
    return this.http.get(environment.api + 'colours', { params: params } ).pipe(
      map((res) => {
        return res;
      })
    );
  }

  

  getSingleColour(id: string) {
    return this.http.get(environment.api + 'colours/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getColoursType() {
    return this.http.get(environment.api + '/referenceCodes/getByType/ColourType').pipe(
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

  public createOrUpdateColours(data: Object) {
    return this.http
      .post(environment.api + 'colours/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete(environment.api + 'colours/delete/' + id);
  }
}
