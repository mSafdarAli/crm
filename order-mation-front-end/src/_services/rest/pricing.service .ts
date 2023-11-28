import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PricingService {
  constructor(private http: HttpClient) {}

  public getExtraPrices(params) {
    return this.http.get(environment.api + 'extraPrices',{params:params}).pipe(
      map((res) => {
        return res;
      })
    );
  }
  public createOrUpdateExtraPrices(data: Object) {
		return this.http.post(environment.api + 'extraPrices/createOrUpdate', data).pipe(map(res => {
			return res;
		}));
	}
	public delete(id: number) {
		return this.http.delete(environment.api + 'extraPrices/delete/'+ id);
	}
  public getSingleExtraPrices(id: string) {
    return this.http.get(environment.api + 'extraPrices/'+ id).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
