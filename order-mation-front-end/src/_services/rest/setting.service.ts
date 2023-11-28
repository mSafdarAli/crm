import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SettingService {
    constructor(private http: HttpClient) { }

    public getSettings() {
        return [
            { name: "Complaint Reasons", value: "complaintReasons" },
            { name: "Configurations", value: "configurations" },
            { name: "Customer Instructions", value: "customerInstructions" },
            { name: "Job Types", value: "jobtype" },
            { name: "Lead Times", value: "leadTimes" },
            { name: "Obtained From", value: "obtainedfrom" },
            { name: "Payment Terms", value: "paymentterms" },
            { name: "Regions", value: "provinces" },
            { name: "Return Reasons", value: "returnReasons" },
            { name: "Roles", value: "siteRoles" },
            { name: "Task Types", value: "taskTypes" }
        ]
    }

    public getSettingGrid(url: string,params) {
        return this.http.get(environment.api + url,{params:params}).pipe(
            map((res) => {
                return res;
            })
        );
    }
    public createOrUpdateSetting(url: string, data: Object) {
        if (['jobtype', 'obtainedfrom', "paymentterms"].indexOf(url) > -1) {
            url = "referenceCodes/"
        }
        return this.http.post(environment.api + url + ((url != 'configurations')?"/createOrUpdate":"/update"), data).pipe(map(res => {
            return res;
        }));
    }

    public deletesetting(id: number, url: string) {
        if (['jobtype', 'obtainedfrom', "paymentterms"].indexOf(url) > -1) {
            url = "referenceCodes/"
        }
        return this.http.delete(environment.api + url + '/delete/' + id);
    }

    public getsingleSetting(url: string, id: string) {
        return this.http.get(environment.api + url + '/' + id).pipe(
            map((res) => {
                return res;
            })
        );
    }

}
