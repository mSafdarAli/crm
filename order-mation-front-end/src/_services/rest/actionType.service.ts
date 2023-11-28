import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class ActionTypeService {
  constructor(private http: HttpClient) { }

  public getAll(params) {
    return this.http.get(environment.api + 'actionTypes', { params: params }).pipe(
      map((res) => {
        return res;
      })
    );
  }
  public getActionTypes() {
    return this.http.get(environment.api + 'actionTypeActions').pipe(
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

  public getSingleActionType(id: string) {
    return this.http.get(environment.api + 'actionTypes/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  }


  public createOrUpdateActionType(data: Object) {
    return this.http
      .post(environment.api + 'actionTypes/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  public deleteActionType(id: number) {
    return this.http.delete(environment.api + 'actionTypes/delete/' + id);
  }

  public getActionTypeList(params) {
    return this.http.get(environment.api + 'actionTypes/getDependencies', { params: params }).pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map((e) => {
            DataList.push({ name: e.description, value: e.id });
          });
          return DataList;
        }
        return null;
      })
    );
  }
  public createDependencies(data: Object) {
    return this.http
      .post(environment.api + 'actionTypes/createDependencies', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  public getDependency(params) {
    return this.http.get(environment.api + 'actionTypes/getDependencies', { params: params }).pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          return res['data']
        }
      })
    );
  }

  public getTemplates(id: string) {
    return this.http.get(environment.api + 'actionTypes/getTemplates/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public deleteTemplate(id: number) {
    return this.http.delete(environment.api + 'actionTypes/deleteTemplate/' + id);
  }

  public createTemplate(id, file) {
    const uploadData = new FormData();
    if (file.length > 0) {
      file.forEach(el => {
        uploadData.append('file', el, el.name);
      });
    }
    return this.http
      .post(environment.api + 'actionTypes/createTemplates/' + id, uploadData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
