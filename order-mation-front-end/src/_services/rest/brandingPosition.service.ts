import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class BrandingPositionService {
  constructor(private http: HttpClient) { }

  public getPosition(params) {
    return this.http.get(environment.api + 'printPositions',{params:params}).pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map((e) => {
            DataList.push({ name: e.name, value: e.id });
          });
          return DataList;
        }
        return null;
      })
    );
  }
   public getEffect(params) {
    return this.http.get(environment.api + 'brandings/getBySupplier',{params:params}).pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          console.log(res['data'])
          var DataList: lookupdata[] = [];
          res['data'].map((e) => {
            DataList.push({ name: e.descriptionName, value: e.id });
          });
          return DataList;
        }
        return null;
      })
    );
  }
  public getCostPrice(params) {
    return this.http.get(environment.api + 'brandingPricing/getSupplierPricing',{params:params}).pipe(
      map((res) => {
        return res;
      })
    );
  }
   public deletePosition(id: number) {
    return this.http.delete(environment.api + 'Quotes/deleteBrandingLine' + id);
  }
}
