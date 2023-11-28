import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { lookupdata } from "src/_models/lookup";

@Injectable({
	providedIn: 'root'
})
export class OrderService {
	constructor(private http: HttpClient) { }

	public getCurrentOrders(params) {
		return this.http.get(environment.api + 'Orders/CurrentOrders', { params: params }).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public getOrdersHistory(params) {
		return this.http.get(environment.api + 'Orders/OrderHistory', { params: params }).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public getQuoteByOrderNo(params) {
		return this.http.get(environment.api + 'Quotes/getByQuoteOrOrderNo', { params: params }).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public sendOrder(data) {
		return this.http.post(environment.api + 'Orders/sendOrder', data).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public sendArtWork(data) {
		return this.http.post(environment.api + 'Orders/sendArtworkFollowUp', data).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public acceptOrder(data: object) {
		return this.http.post(environment.api + 'Orders/acceptOrder', { orderNo: data }).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public repeatOrder(id) {
		return this.http.post(environment.api + 'Quotes/repeatQuote/' + id, {}).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}

	//dispatch Notes

	public dispatchNotes(id) {
		return this.http.get(environment.api + 'dispatch/getByQuote/' + id).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public createDispatch(data) {
		return this.http.post(environment.api + 'dispatch/create' , data).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public receivingNotes(id) {
		return this.http.get(environment.api + 'receiving/getByQuote/' + id).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public createReceiving(data) {
		return this.http.post(environment.api + 'receiving/create' , data).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public receivinghistory(id) {
		return this.http.get(environment.api + 'receiving/getHistoryByQuote/' + id).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public dispatchHistory(id) {
		return this.http.get(environment.api + 'dispatch/getHistoryByQuote/' + id).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public printReceivingNote(id, documentNo) {
		return this.http.get(environment.api + 'receiving/printReceivingNote/' + id + '/' + documentNo).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public printDispatchNote(id, documentNo) {
		return this.http.get(environment.api + 'dispatch/printDispatchNote/' + id + '/' + documentNo).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public getPurchaseByQuote(id) {
		return this.http.get(environment.api + 'purchaseOrders/getByQuote/' + id).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public getBrandingPurchaseByQuote(id) {
		return this.http.get(environment.api + 'purchaseOrders/branding/getByQuote/' + id).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public updatePurchase(data) {
		return this.http.post(environment.api + 'purchaseOrders/update',data).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public updateBrandingPurchase(data) {
		return this.http.post(environment.api + 'purchaseOrders/branding/update',data).pipe(
			map((res) => {
				return res;
			})
		);
	}

	public getSinglePurchase(id) {
		return this.http.get(environment.api + 'purchaseOrders/' + id).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public getSingleBrandingPurchase(id) {
		return this.http.get(environment.api + 'purchaseOrders/branding/' + id).pipe(
			map((res) => {
				return res;
			})
		);
	}
	 public deletePurchase(id) {
		return this.http.delete(environment.api + 'purchaseOrders/delete/' + id).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public deleteBrandingPurchase(id) {
		return this.http.delete(environment.api + 'purchaseOrders/branding/delete/' + id).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public printPurchase(id) {
		return this.http.get(environment.api + 'purchaseOrders/printPurchaseOrders/' + id).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public printBrandingPurchase(id) {
		return this.http.get(environment.api + 'purchaseOrders/branding/printPurchaseOrders/' + id).pipe(
			map((res) => {
				return res;
			})
		);
	}
	
	public sendPurchase(id) {
		return this.http.post(environment.api + 'purchaseOrders/sendPurchaseOrders/' + id , {}).pipe(
			map((res) => {
				return res;
			})
		);
	}
	
	public sendBrandingPurchase(id) {
		return this.http.post(environment.api + 'purchaseOrders/branding/sendPurchaseOrders/' + id , {}).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public reSendAction(id) {
		return this.http.post(environment.api + 'Actions/resendAction/' + id , {}).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public getUsers(params) {
		return this.http
		  .get(environment.api + 'users' , {params:params})
		  .pipe(
			map((res) => {
			  if (res['statusDescription'] == 'Ok') {
				var DataList: lookupdata[] = [];
				res['data'].map((e) => {
				  DataList.push({ name: e.firstName + ' ' +  e.lastName, value: e.id });
				});
				return DataList;
			  }
			  return null;
			})
		  );
	}
	public printActions(id) {
		return this.http.get(environment.api + 'Actions/printActionList/' + id).pipe(
			map((res) => {
				return res;
			})
		);
	}
	 public sendActionsList(id) {
		return this.http.post(environment.api + 'Actions/sendActionList/'+id ,{}).pipe(
			map((res) => {
				return res;
			})
		);
	}
	 public getActions(id) {
		return this.http.get(environment.api + 'actions/getActionsAndDependencies/'+ id).pipe(
			map((res) => {
				return res;
			})
		);
	}
	  public deleteActions(id) {
		return this.http.delete(environment.api + 'actions/delete/'+ id).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public viewAttachment(id) {
		return this.http.get(environment.api + 'attachments/getByActionList/'+ id).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public printOrder(id) {
		return this.http.get(environment.api + 'Orders/printOrder/'+ id).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public overRide(data) {
		return this.http.post(environment.api + 'users/override',  data).pipe(
			map((res) => {
				return res;
			})
		);
	}
	public createWithFiles(data, files=[]) {
		const uploadData = new FormData();
		if (files.length > 0) {
			files.forEach(el => {
				uploadData.append('file', el, el.name);
			});
		}
		uploadData.append("orderNo", data["orderNo"]);
		uploadData.append("name", data["actionName"]?.value);
		uploadData.append("actionType", data["actionType"]);
		uploadData.append("notes", data["notes"]);
		uploadData.append("description", data["description"]);
		uploadData.append("extraFieldDescription", data["extraFieldDescription"]);
		uploadData.append("actionDate", data["actionDate"]);
		return this.http.post(environment.api + 'actions/createWithFiles', uploadData).pipe(
			map((res) => {
				return res;
			})
		);
	}
}