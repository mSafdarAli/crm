import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: 'root'
})
export class CommentService {
	constructor(private http: HttpClient) { }

	public getComments(commentType, id) {
		return this.http.get(environment.api + 'comments/' + commentType + '/' + id).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}

	// public commentsType() {
	// 	return [
	// 		{ name: 'Quote', value: 'Quote' },
	// 		{ name: 'Order', value: 'Order' },
	// 		{ name: 'Receiving Note', value: 'ReceivingNote' },
	// 		{ name: 'Dispatch Note', value: 'DispatchNote' },
	// 		{ name: 'Action List', value: 'ActionList' },
	// 		{ name: 'task', value: 'Task' }
	// 	];
	// }
	public createComments(data,files) {
		const uploadData = new FormData();
		if (files.length > 0) {
			files.forEach(el => {
				uploadData.append('file', el, el.name);
			});
		}
		uploadData.append("commentText", data["commentText"]);
		uploadData.append("commentType", data["commentType"]);
		uploadData.append("linkId", data["linkId"]);

		return this.http.post(environment.api + 'comments/create', uploadData).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
	
	public getAttachments(id) {
		return this.http.get(environment.api + 'attachments/getByTypeAndLink/Comment/' + id).pipe(map(res => {
			if (res['statusCode'] == 200) {
				return res;
			}
			return null
		}));
	}
}

