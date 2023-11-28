import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: 'root'
})
export class ComplaintService {
	constructor(private http: HttpClient) { }

	public getCurrentComplaints(params) {
		return this.http.get(environment.api + 'complaints/currentComplaints', {params:params}).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return (typeof res['data'] != 'string') ? res : [];
			}
			return null
		}));
	}

	public getComplaintsByQuoteNo(id) {
		return this.http.get(environment.api + 'complaints/getByQuote/'+id).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return (typeof res['data'] != 'string') ? res : [];
			}
			return null
		}));
	}

	public createComplaint(data: Object) {
		const uploadData = new FormData();
		if (data["attachments"].length > 0) {
			data["attachments"].forEach(el => {
				uploadData.append('file', el, el.name);
			});
		}
		uploadData.append("quoteId", data["quoteId"]);
		uploadData.append("reasonId", data["reasonId"]);
		uploadData.append("notes", data["notes"]);
		return this.http
			.post(environment.api + 'complaints/create', uploadData)
			.pipe(
				map((res) => {
					return res;
				})
			);
	}

	public resolveComplaint(data: Object) {
		return this.http
			.post(environment.api + 'complaints/resolve', data)
			.pipe(
				map((res) => {
					return res;
				})
			);
	}

	public getComplaintHistory(params) {
		return this.http.get(environment.api + 'complaints/complaintsHistory', { params: params }).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	public viewAttachments(id) {
		return this.http.get(environment.api + 'attachments/getByTypeAndQuote/Complaint/'+id).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	
} 