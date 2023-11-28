import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeightsService {
  constructor(private http: HttpClient) {}

  getWeights(params) {
    return this.http.get(environment.api + 'weights' ,{params:params}).pipe(
      map((res) => {
        return res;
      })
    );
  }

  

  getSingleWeights(id: string) {
    return this.http.get(environment.api + 'weights/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  } 

  public createOrUpdateWeights(data: Object) {
    return this.http
      .post(environment.api + 'weights/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete(environment.api + 'weights/delete/' + id);
  }
}
