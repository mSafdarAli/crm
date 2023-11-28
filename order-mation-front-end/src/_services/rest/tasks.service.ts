import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}    

  getCurrentTasks(params) {
    return this.http.get(environment.api + 'tasks/currentTasks', { params: params }).pipe(        
      map((res) => {       
        return res;
      })
    );
  } 

  getTaskHistory(params) {
    return this.http.get(environment.api + 'tasks/taskHistory', {params: params}).pipe(        
      map((res) => {       
        return res;
      })
    );
  } 
  
  public createOrUpdatetasks(data: Object) {
    return this.http
      .post(environment.api + 'tasks/createOrUpdate', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public assignTask(taskId: string, assignedToId: number) {
    return this.http
      .post(environment.api + '/tasks/changeStatus/assigned/' + taskId + '/' + assignedToId, {})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public repeatTask(id : string) {
    return this.http
      .post(environment.api + 'tasks/repeatTask/' + id ,{})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getSingleTask(id : string ) {
    return this.http.get(environment.api + 'tasks/' + id).pipe(        
      map((res) => {       
        return res;
      })
    );
  } 

  // getAssigned(id : string ) {
  //   return this.http.get(environment.api + 'tasks/' + id).pipe(        
  //     map((res) => {       
  //       return res;
  //     })
  //   );
  // } 

  public createOrUpdateAssignTo(id : string, data: object) {
    return this.http
      .post(environment.api + 'tasks/' + id, data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public changeStatus(status: String, id: number) {
		return this.http.post(environment.api + 'tasks/changeStatus/' + status + '/' + id, {}).pipe(map(res => {
			return (typeof res['data'] != 'string') ? res : [];
		}));
	}
  getComments(id : string) {
    return this.http.get(environment.api + 'comments/quote/' + id).pipe(        
      map((res) => {       
        return res;
      })
    );
  } 
}
