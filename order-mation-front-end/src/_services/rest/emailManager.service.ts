import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class EmailManagerService {
  constructor(private http: HttpClient) {}

  getNotifications(params) {
    return this.http.get(environment.api + 'notifications' , {params:params}).pipe(
      map((res) => {
        return res;
      })
    );
  }

  

  getSingleEmailNotification(id: string) {
    return this.http.get(environment.api + 'notifications/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public createOrUpdateNotification(data: Object) {
    return this.http
      .post(environment.api + 'notifications/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete(environment.api + 'notifications/delete/' + id);
  }
}
