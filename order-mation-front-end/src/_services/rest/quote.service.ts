import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { lookupdata } from "src/_models/lookup";

@Injectable({
	providedIn: 'root'
})
export class QuoteService {
	constructor(private http: HttpClient) { }

	public getCurrentQuotes(params = null) {
		return this.http.get(environment.api + 'Quotes/CurrentQuotes', { params: params }).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public getQuotesHistory(params = null) {
		return this.http.get(environment.api + 'Quotes/QuoteHistory', { params: params }).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public getDeliveryOptions() {
		return this.http.get(environment.api + 'extraPrices/getDeliveryOptions').pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public viewQuote(id) {
		return this.http.get(environment.api + 'Quotes/' + id).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public createOrder(data: object) {
		return this.http.post(environment.api + 'quotes/createOrder', data).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public changeStatus(status: String, id: number) {
		return this.http.post(environment.api + 'Quotes/followUpStatus/' + status + '/' + id, {}).pipe(map(res => {
			return (typeof res['data'] != 'string') ? res : [];
		}));
	}
	public getSize(params) {
		return this.http.get(environment.api + 'sizes/getBySupplierAndProduct', { params: params }).pipe(
			map((res) => {
				console.log(res['data'])
				if (res['statusDescription'] == 'Ok') {
					var DataList: lookupdata[] = [];
					res['data'].map(e => {
						DataList.push({ name: e.code, value: e.id });

					});
					return DataList;
				}
				return null
			})
		);
	}
	public getColor(params) {
		return this.http.get(environment.api + 'colours/getBySupplierAndProduct', { params: params }).pipe(
			map((res) => {
				if (res['statusDescription'] == 'Ok') {
					var DataList: lookupdata[] = [];
					res['data'].map(e => {
						DataList.push({ name: e.name, value: e.id });

					});
					return DataList;
				}
				return null
			})
		);
	}
	public getWeight(params) {
		return this.http.get(environment.api + 'weights/getBySupplierAndProduct', { params: params }).pipe(
			map((res) => {
				if (res['statusDescription'] == 'Ok') {
					var DataList: lookupdata[] = [];
					res['data'].map(e => {
						DataList.push({ name: e.name, value: e.id });

					});
					return DataList;
				}
				return null
			})
		);
	}
	public getCostSelling(params) {
		return this.http.get(environment.api + 'productPrices/getByKeys', { params: params }).pipe(
			map((res) => {
				return res
			})
		);
	}

	public getMarkUp() {
		return this.http.get(environment.api + 'extraPrices/getMarkup').pipe(
			map((res) => {
				return res
			})
		);
	}

	public checkStock(params) {
		return this.http.get(environment.api + 'products/checkStock', { params: params }).pipe(
			map((res) => {
				return res
			})
		);
	}

	public getImage(id) {
		return this.http.get(environment.api + 'products/getProductImage/' + id).pipe(
			map((res) => {
				return res
			})
		);
	}
	public deleteQuoteLine(id: number) {
		return this.http.delete(environment.api + 'Quotes/deleteLine/' + id);
	}

	public createQuote(data: Object) {
		return this.http.post(environment.api + 'Quotes/createByIds', data).pipe(map(res => {
			return res;
		}));
	}
	public sendQuote(data: Object) {
		return this.http.post(environment.api + 'Quotes/sendQuote', data).pipe(map(res => {
			return res;
		}));
	}
	public sendFollowUp(data) {
		return this.http.post(environment.api + 'Quotes/sendFollowUp', data).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public rejectQuote(id) {
		return this.http.post(environment.api + 'Quotes/rejectQuote/' + id, {})
	}
	public actionList(id) {
		return this.http.get(environment.api + 'actions/getActionsAndDependencies/' + id).pipe(
			map((res) => {
				return (typeof res['data'] != 'string') ? res : [];
			})
		);
	}
	// for productSearch

	public getProductSearch(params) {
		return this.http.get(environment.api + 'productSearch/getByCriteria', { params: params }).pipe(
			map((res) => {
				return (typeof res['data'] != 'string') ? res : [];
			})
		);
	}
	public getQuoteByOrderNo(params) {
		return this.http.get(environment.api + 'Quotes/getByQuoteOrOrderNo', { params: params }).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}

	public repeatQuote(id, data: Object = {}) {
		return this.http.post(environment.api + 'Quotes/repeatQuote/' + id, data).pipe(map(res => {
			return res;
		}));
	}
	public reOpenQuote(id, data: Object = {}) {
		return this.http.post(environment.api + 'Quotes/reOpenQuote/' + id, data).pipe(map(res => {
			return res;
		}));
	}
}