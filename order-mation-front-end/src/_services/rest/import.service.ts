import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: 'root'
})
export class ImportService {
	constructor(private http: HttpClient) { }

	public getExcelTemplate() {
		return this.http.get(environment.api + 'importProducts/Excel/getTemplate').pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public getSupplierProducts(supplierName: string) {
		return this.http.get(environment.api + 'importProducts/' + supplierName).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}


	public getExcelBySupplier(supplierId: string) {
		return this.http.get(environment.api + 'importProducts/Export/' + supplierId).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}

	public exportFile(data: Object, file) {
		const uploadData = new FormData();
		if(file){
			uploadData.append('file', file, file.name);
		}
		return this.http
			.post(environment.api + 'importProducts/Excel', uploadData)
			.pipe(
				map((res) => {
					return res;
				})
			);
	}
}

