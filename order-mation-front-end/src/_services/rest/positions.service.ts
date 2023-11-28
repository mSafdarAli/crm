import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PositionService {
    constructor(private http: HttpClient) { }

    getPositions(params) {
        return this.http.get(environment.api + 'printPositions' , {params:params}).pipe(
            map((res) => {
                return res;
            })
        );
    }

    public deletePosition(id: number) {
        return this.http.delete(environment.api + 'printPositions/delete/' + id);
    }

    public createOrUpdatePosition(data: Object) {
        return this.http.post(environment.api + 'printPositions/createOrUpdate', data).pipe(map(res => {
            return res;
        }));
    }


    getSingleColour(id: string) {
        return this.http.get(environment.api + 'printPositions/' + id).pipe(
            map((res) => {
                return res;
            })
        );
    }
}