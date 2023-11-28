import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
  })
  export class RemindersService {
    constructor(private http: HttpClient) { }
    public getAllReminders(params) {
        return this.http.get(environment.api + 'reminders' , {params:params}).pipe(
          map((res) => {
            return res
          })
        );
      }
      public deleteReminder(id: number) {
        return this.http.delete(environment.api + 'reminders/delete/' + id);
    }
    public getSingleReminder(id: string) {
        return this.http.get(environment.api + 'reminders/' + id).pipe(
          map((res) => {
            return res;
          })
        );
      }
    public getDates() {
		return [
			{ name: "Quote", value: "Quote" },
			{ name: "Order", value: "Order" },
			{ name: "Deadline", value: "Deadline" },
			{ name: "Artwork Sent", value: "Artwork Sent" },
			{ name: "Action", value: "Action" },
			{ name: "Birthday", value: "Birthday" },
			{ name: "Tasks – Due Date – Not Started", value: "Tasks – Due Date – Not Started" },
			{ name: "Tasks – Due Date – Not Completed", value: "Tasks – Due Date – Not Completed" },
			{ name: "Lead – Logged", value: "Lead – Logged" },
			{ name: "Lead – Assigned", value: "Lead – Assigned" },
			{ name: "Lead – Contacted", value: "Lead – Contacted" },
		
		]
	}
    public createOrUpdateReminder(data: Object) {
        return this.http
          .post(environment.api + 'reminders/createOrUpdate', data)
          .pipe(
            map((res) => {
              return res;
            })
          );
      }
  }  